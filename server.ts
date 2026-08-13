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
  const pass = process.env.SMTP_PASS || '655e270905f76b04a0c27586d4b64d95';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
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

  // Send Telegram notification
  const tgToken = process.env.TELEGRAM_BOT_TOKEN || '8920101288:AAEQhC08geOKnAvWcnvwjtvb0x8dJxCgx3E';
  if (tgToken) {
    try {
      const tgText = `🔔 <b>Новая заявка с сайта юриста!</b>\n\n` +
        `👤 <b>Имя:</b> ${newReq.name}\n` +
        `📞 <b>Телефон:</b> ${newReq.phone}\n` +
        `📧 <b>Email:</b> ${newReq.email}\n` +
        `📋 <b>Тема:</b> ${newReq.topic}\n` +
        `💬 <b>Сообщение:</b> ${newReq.message || 'Без текста'}`;

      const updatesRes = await fetch(`https://api.telegram.org/bot${tgToken}/getUpdates`);
      if (updatesRes.ok) {
        const updatesData: any = await updatesRes.json();
        if (updatesData.ok && Array.isArray(updatesData.result)) {
          for (const item of updatesData.result) {
            const cid = item.message?.chat?.id || item.channel_post?.chat?.id;
            if (cid) {
              await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: cid, parse_mode: 'HTML', text: tgText })
              });
            }
          }
        }
      }
    } catch (tgErr) {
      console.error('[TELEGRAM ERROR]', tgErr);
    }
  }

  // Send email notification to sonicdeath7@yandex.ru
  const transporter = getTransporter();
  let emailStatusNotice = '';

  if (transporter) {
    try {
      const mailSender = process.env.SMTP_USER || 'sonicdeath7@yandex.ru';
      await transporter.sendMail({
        from: `"Сайт Юриста" <${mailSender}>`,
        to: NOTIFICATION_EMAIL,
        replyTo: email && email.includes('@') ? email : undefined,
        subject: `[Новая заявка с сайта] ${newReq.topic}`,
        html: `
          <h2>Новая заявка на консультацию</h2>
          <p><strong>Имя:</strong> ${newReq.name}</p>
          <p><strong>Телефон:</strong> ${newReq.phone}</p>
          <p><strong>E-mail клиента:</strong> ${newReq.email}</p>
          <p><strong>Тема:</strong> ${newReq.topic}</p>
          <p><strong>Сообщение:</strong></p>
          <blockquote style="background: #f4f4f4; padding: 10px; border-left: 3px solid #d4af37;">
            ${newReq.message || 'Без комментария'}
          </blockquote>
          <p><em>Заявка принята: ${new Date().toLocaleString('ru-RU')}</em></p>
        `
      });
      newReq.emailSent = true;
      console.log(`[EMAIL SUCCESS] Уведомление отправлено на ${NOTIFICATION_EMAIL}`);
      emailStatusNotice = `Заявка принята и отправлена на ${NOTIFICATION_EMAIL}.`;
    } catch (err) {
      console.error(`[EMAIL ERROR] Ошибка отправки на ${NOTIFICATION_EMAIL}:`, err);
      emailStatusNotice = `Заявка сохранена в базе.`;
    }
  } else {
    console.log(`[EMAIL INFO] Уведомление для ${NOTIFICATION_EMAIL} зафиксировано в системе. Укажите SMTP_USER и SMTP_PASS в секретах/переменных для реальной отправки писем.`);
    emailStatusNotice = `Заявка принята и зафиксирована для ${NOTIFICATION_EMAIL}.`;
  }

  res.json({
    success: true,
    requestId: newReq.id,
    targetEmail: NOTIFICATION_EMAIL,
    message: `Заявка успешно отправлена! Константин Алексеевич свяжется с вами в течение 15-30 минут.`
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
