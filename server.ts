import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Target email for notifications
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'sonicdeath7@yandex.ru';

// Create mail transporter if SMTP credentials exist
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.yandex.ru';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'sonicdeath7@yandex.ru';
  const pass = process.env.SMTP_PASS || '608afa43ea25130d5315f497b76a6cc3';

  return nodemailer.createTransport({
    host,
    port,
    secure: true,
    auth: { user, pass }
  });
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

  // PRIMARY METHOD: Resend API (HTTPS)
  const RESEND_KEY = process.env.RESEND_API_KEY || 're_fPuWkXjD_2NCpPyNV47Xk56Jw5qjy1frE';
  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Сайт Юриста <onboarding@resend.dev>',
        to: [NOTIFICATION_EMAIL],
        subject: `[Заявка с сайта юриста] ${newReq.topic} - ${newReq.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #1a2a3a; margin-top: 0;">🔔 Новая заявка с сайта</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Имя:</td><td>${newReq.name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Телефон:</td><td><a href="tel:${newReq.phone}" style="color: #c5a059; text-decoration: none;">${newReq.phone}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email клиента:</td><td>${newReq.email}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Тема:</td><td>${newReq.topic}</td></tr>
            </table>
            <div style="margin-top: 15px; padding: 12px; background: #f9f9f9; border-left: 4px solid #c5a059; border-radius: 4px;">
              <strong>Сообщение:</strong><br>
              ${newReq.message ? newReq.message.replace(/\n/g, '<br>') : '<em>Без текста сообщения</em>'}
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Заявка принята: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)</p>
          </div>
        `
      })
    });

    const resendResult: any = await resendResponse.json();
    console.log('[RESEND RESPONSE]', resendResponse.status, JSON.stringify(resendResult));

    if (resendResponse.ok && resendResult.id) {
      emailSent = true;
      newReq.emailSent = true;
      console.log(`[RESEND SUCCESS] ID: ${resendResult.id}`);
    }
  } catch (resendErr: any) {
    console.error('[RESEND ERROR]', resendErr?.message || resendErr);
  }

  if (!emailSent) {
    const transporter = getTransporter();
    try {
      const mailSender = process.env.SMTP_USER || 'sonicdeath7@yandex.ru';
      const info = await transporter.sendMail({
        from: `"Сайт Юриста Мирошина" <${mailSender}>`,
        to: NOTIFICATION_EMAIL,
        replyTo: email && email.includes('@') ? email : undefined,
        subject: `[Заявка с сайта юриста] ${newReq.topic}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #1a2a3a; margin-top: 0;">🔔 Новая заявка с сайта</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Имя:</td><td>${newReq.name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Телефон:</td><td><a href="tel:${newReq.phone}" style="color: #c5a059; text-decoration: none;">${newReq.phone}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email клиента:</td><td>${newReq.email}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Тема:</td><td>${newReq.topic}</td></tr>
            </table>
            <div style="margin-top: 15px; padding: 12px; background: #f9f9f9; border-left: 4px solid #c5a059; border-radius: 4px;">
              <strong>Сообщение:</strong><br>
              ${newReq.message ? newReq.message.replace(/\n/g, '<br>') : '<em>Без текста сообщения</em>'}
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">Заявка принята: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)</p>
          </div>
        `
      });
      newReq.emailSent = true;
      emailSent = true;
      console.log(`[EMAIL SUCCESS] Письмо успешно отправлено через Yandex SMTP на ${NOTIFICATION_EMAIL}. MessageId: ${info.messageId}`);
    } catch (err: any) {
      console.error(`[SMTP ERROR] Yandex SMTP failed:`, err?.message || err);
      emailErrorMsg = `SMTP: ${err?.message || String(err)}`;
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
