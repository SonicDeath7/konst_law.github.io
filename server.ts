import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Target email for notifications (100% RU market infrastructure)
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'sonicdeath7@yandex.ru';

// Helper to send mail via Yandex SMTP with multiple configuration fallbacks
async function sendViaYandexSMTP(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const rawPass = process.env.SMTP_PASS || 'uvqopyjikedhlyhd';
  const pass = rawPass.trim().replace(/\s+/g, '');
  const rawUser = process.env.SMTP_USER || 'sonicdeath7@yandex.ru';
  const cleanUser = rawUser.trim();
  const userWithoutDomain = cleanUser.split('@')[0];
  const userWithDomain = cleanUser.includes('@') ? cleanUser : `${cleanUser}@yandex.ru`;

  // List of auth combinations to try
  const strategies = [
    { host: 'smtp.yandex.ru', port: 465, secure: true, user: userWithDomain, desc: 'port 465 (SSL) with full email' },
    { host: 'smtp.yandex.ru', port: 465, secure: true, user: userWithoutDomain, desc: 'port 465 (SSL) with username only' },
    { host: 'smtp.yandex.ru', port: 587, secure: false, user: userWithDomain, desc: 'port 587 (STARTTLS) with full email' },
    { host: 'smtp.yandex.ru', port: 587, secure: false, user: userWithoutDomain, desc: 'port 587 (STARTTLS) with username only' },
  ];

  let lastError = '';

  for (const strategy of strategies) {
    try {
      const transporter = nodemailer.createTransport({
        host: strategy.host,
        port: strategy.port,
        secure: strategy.secure,
        auth: {
          user: strategy.user,
          pass: pass
        },
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 10000
      });

      const mailSender = userWithDomain;
      const info = await transporter.sendMail({
        from: `"Сайт Юриста Мирошина" <${mailSender}>`,
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        html: options.html
      });

      console.log(`[YANDEX SMTP SUCCESS] Отправлено успешно через ${strategy.desc}! MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      lastError = err?.message || String(err);
      console.warn(`[YANDEX SMTP TRY FAILED] (${strategy.desc}): ${lastError}`);
    }
  }

  return { success: false, error: lastError };
}

// In-memory store for contact form requests
interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  date: string;
  status: 'new' | 'reviewed' | 'contacted';
  emailSent?: boolean;
}

const contactRequests: ContactRequest[] = [
  {
    id: 'req-1',
    name: 'Алексей Сергеевич В.',
    phone: '+7 910 123 4567',
    email: 'vlasov@company.ru',
    topic: 'Арбитражный спор по договору подряда',
    message: 'Заказчик отказывается подписывать КС-2 и оплачивать выполненные работы на сумму 3.2 млн руб. Требуется защита в суде.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'reviewed',
    emailSent: false
  },
  {
    id: 'req-2',
    name: 'Елена Николаевна',
    phone: '+7 905 987 6543',
    email: 'elena.biz@mail.ru',
    topic: 'Проверка договора купли-продажи коммерческой недвижимости',
    message: 'Планируем покупку складского помещения. Нужен комплексный правовой аудит сделки и рисков.',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'new',
    emailSent: false
  }
];

// API Endpoints
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Юрист Мирошин К.А. API', targetEmail: NOTIFICATION_EMAIL });
});

// AI Legal Assistant API Endpoint
app.post('/api/chat', async (req, res) => {
  const { query, history } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Параметр query обязателен.' });
  }

  const systemInstruction = `Вы — официальный виртуальный AI-помощник на сайте юриста Мирошина Константина Алексеевича.
Ваша задача — давать вежливые, четкие, структурированные и грамотные первичные разъяснения по праву РФ (ГК РФ, ЗоЗПП РФ, АПК РФ, ГПК РФ, ТК РФ, ЖК РФ).

КРИТИЧЕСКИЕ ПРАВИЛА:
1. Пишите емко, разбивая ответ на пункты и шаги (1, 2, 3).
2. Обязательный дисклеймер: в конце ответа обязательно напомните: «Ответ сформирован ИИ и носит исключительно ознакомительный характер. Не является официальной юридической консультацией.»
3. Предупреждение о ПДн: если пользователь пытается передать паспортные данные или номера документов, напомните не вводить персональные данные в чат (152-ФЗ).
4. Если ситуация сложная, требует анализа договоров, судебного представительства или экспертизы — порекомендуйте обратиться к юристу Мирошину Константину Алексеевичу через кнопку «Записаться на консультацию» или по телефону +7 (910) 700-08-01.`;

  // Google Gemini API with multi-model fallback (gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash)
  const geminiModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const formattedHistory = Array.isArray(history)
        ? history.map((h: any) => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(h.content || '') }]
          }))
        : [];

      for (const modelName of geminiModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              ...formattedHistory,
              { role: 'user', parts: [{ text: query }] }
            ],
            config: {
              systemInstruction,
              temperature: 0.3
            }
          });

          if (response.text) {
            return res.json({ answer: response.text, source: 'gemini' });
          }
        } catch (geminiErr: any) {
          console.warn(`[Gemini API ${modelName} Attempt]`, geminiErr?.message || geminiErr);
          // Continue to next fallback model
        }
      }
    } catch (clientErr: any) {
      console.warn('[Gemini Client Init]', clientErr?.message || clientErr);
    }
  }

  // 3. Fallback response
  res.json({
    answer: `### Первичные правовые рекомендации\n\nПо вашему вопросу: «${query}»\n\n1. **Сбор доказательств:** Соберите и зафиксируйте все подтверждающие документы (договоры, квитанции, переписку, акты).\n2. **Досудебный порядок:** В большинстве споров по законодательству РФ первоочередным шагом является направление мотивированной претензии.\n3. **Индивидуальный анализ:** Для подробного правового заключения и подготовки процессуальных документов рекомендуем обратиться к юристу Мирошину К.А. по тел. +7 (910) 700-08-01.\n\n*Ответ сформирован ИИ и носит исключительно ознакомительный характер.*`,
    source: 'knowledge_base'
  });
});

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, topic, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Пожалуйста, укажите имя и телефон для связи.' });
  }

  const newReq: ContactRequest = {
    id: `req-${Date.now()}`,
    name,
    phone,
    email: email || 'Не указан',
    topic: topic || 'Общая юридическая консультация',
    message: message || '',
    date: new Date().toISOString(),
    status: 'new',
    emailSent: false
  };

  contactRequests.unshift(newReq);

  console.log(`[CONTACT FORM] Новая заявка от ${name} (${phone}): ${topic}`);

  let emailSent = false;
  let emailErrorMsg = '';

  // 1. PRIMARY METHOD FOR RUSSIAN MARKET: Yandex SMTP (smtp.yandex.ru)
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <div style="border-bottom: 2px solid #d97706; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 20px;">⚖️ Новая заявка с сайта юриста</h2>
        <p style="color: #64748b; margin: 4px 0 0 0; font-size: 14px;">Официальный сайт юриста Мирошина К.А.</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px 0; font-weight: bold; width: 140px; color: #475569; border-bottom: 1px solid #f1f5f9;">Имя клиента:</td>
          <td style="padding: 10px 0; color: #0f172a; font-size: 16px; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${newReq.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Телефон:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
            <a href="tel:${newReq.phone}" style="color: #d97706; text-decoration: none; font-size: 16px; font-weight: bold;">${newReq.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Email:</td>
          <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${newReq.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9;">Тема обращения:</td>
          <td style="padding: 10px 0; color: #0f172a; font-weight: 500; border-bottom: 1px solid #f1f5f9;">${newReq.topic}</td>
        </tr>
      </table>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #d97706; padding: 14px 16px; border-radius: 4px; margin-bottom: 20px;">
        <div style="font-weight: bold; color: #334155; margin-bottom: 6px; font-size: 14px;">Сообщение / Детали дела:</div>
        <div style="color: #1e293b; line-height: 1.5; font-size: 14px;">
          ${newReq.message ? newReq.message.replace(/\n/g, '<br>') : '<em>Клиент не оставил дополнительного текста</em>'}
        </div>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 12px; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Время заявки: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)</span>
        <span>ID: ${newReq.id}</span>
      </div>
    </div>
  `;

  const yandexResult = await sendViaYandexSMTP({
    to: NOTIFICATION_EMAIL,
    replyTo: email && email.includes('@') ? email : undefined,
    subject: `[Заявка с сайта юриста] ${newReq.topic} — ${newReq.name}`,
    html: emailHtml
  });

  if (yandexResult.success) {
    newReq.emailSent = true;
    emailSent = true;
  } else {
    emailErrorMsg = `Yandex SMTP: ${yandexResult.error}`;
  }

  // 2. BACKUP METHOD: Resend API (если задан персональный ключ)
  if (!emailSent && process.env.RESEND_API_KEY) {
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Сайт Юриста <onboarding@resend.dev>',
          to: [NOTIFICATION_EMAIL],
          subject: `[Заявка с сайта юриста] ${newReq.topic} - ${newReq.name}`,
          html: `<p>Имя: ${newReq.name}</p><p>Телефон: ${newReq.phone}</p><p>Тема: ${newReq.topic}</p><p>${newReq.message}</p>`
        })
      });

      const resendResult: any = await resendResponse.json();
      if (resendResponse.ok && resendResult.id) {
        emailSent = true;
        newReq.emailSent = true;
        console.log(`[RESEND SUCCESS] ID: ${resendResult.id}`);
      }
    } catch (resendErr: any) {
      console.error('[RESEND ERROR]', resendErr?.message || resendErr);
    }
  }

  // Fallback 0: Google Apps Script Web App
  if (!emailSent) {
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxs-arJaFBZZNYjmel8aMgFmwQhKv0SBkL3Ejbd9vrKq11OmoTzIqvKrd0sZ91K0ie-/exec';
      const qParams = new URLSearchParams({
        name: newReq.name,
        phone: newReq.phone,
        email: newReq.email,
        topic: newReq.topic,
        message: newReq.message || ''
      });

      const gasRes = await fetch(`${GOOGLE_SCRIPT_URL}?${qParams.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReq.name,
          phone: newReq.phone,
          email: newReq.email,
          topic: newReq.topic,
          message: newReq.message || ''
        })
      });

      if (gasRes.ok || gasRes.status === 302 || gasRes.status === 200) {
        emailSent = true;
        newReq.emailSent = true;
        console.log(`[EMAIL SUCCESS] Заявка отправлена в Google Apps Script для ${NOTIFICATION_EMAIL}`);
      }
    } catch (gasErr: any) {
      console.error('[Google Script ERROR]', gasErr?.message || gasErr);
    }
  }

  // Fallback 1: Web3Forms HTTP API (Server-side from Node.js)
  if (!emailSent) {
    try {
      const w3res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '18bb6465-b83f-4dbd-89f1-c3adfb3171e1',
          name: newReq.name,
          phone: newReq.phone,
          email: newReq.email !== 'Не указан' ? newReq.email : undefined,
          from_name: 'Сайт Юриста Мирошина',
          subject: `[Заявка с сайта юриста] ${newReq.topic}`,
          message: `Имя: ${newReq.name}\nТелефон: ${newReq.phone}\nEmail: ${newReq.email}\nТема: ${newReq.topic}\nСообщение: ${newReq.message}`
        })
      });
      if (w3res.ok) {
        const w3data: any = await w3res.json();
        if (w3data.success) {
          emailSent = true;
          newReq.emailSent = true;
          console.log(`[EMAIL SUCCESS] Письмо успешно отправлено через Web3Forms на ${NOTIFICATION_EMAIL}`);
        } else {
          console.warn('[Web3Forms ERROR]', w3data.message);
        }
      }
    } catch (w3err: any) {
      console.error('[Web3Forms FETCH ERROR]', w3err?.message || w3err);
    }
  }

  // Fallback 2: FormSubmit HTTP API (Server-side from Node.js)
  if (!emailSent) {
    try {
      const fsRes = await fetch(`https://formsubmit.co/ajax/${NOTIFICATION_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          'Имя': newReq.name,
          'Телефон': newReq.phone,
          'Email': newReq.email,
          'Тема': newReq.topic,
          'Сообщение': newReq.message,
          '_subject': `[Заявка с сайта юриста] ${newReq.topic}`,
          '_captcha': 'false'
        })
      });
      if (fsRes.ok) {
        const fsdata: any = await fsRes.json();
        if (fsdata.success === 'true' || fsdata.success === true) {
          emailSent = true;
          newReq.emailSent = true;
          console.log(`[EMAIL SUCCESS] Письмо успешно отправлено через FormSubmit на ${NOTIFICATION_EMAIL}`);
        }
      }
    } catch (fserr: any) {
      console.error('[FormSubmit FETCH ERROR]', fserr?.message || fserr);
    }
  }

  res.json({
    success: true,
    requestId: newReq.id,
    targetEmail: NOTIFICATION_EMAIL,
    emailSent,
    emailError: emailErrorMsg || undefined,
    message: `Заявка успешно отправлена! Константин Алексеевич свяжется с вами в ближайшее время.`
  });
});

app.get('/api/requests', (_req, res) => {
  res.json({ success: true, targetEmail: NOTIFICATION_EMAIL, count: contactRequests.length, requests: contactRequests });
});

// Setup Vite or Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
