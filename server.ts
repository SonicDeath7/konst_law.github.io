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

  // Send email notification to sonicdeath7@yandex.ru via Yandex SMTP
  const transporter = getTransporter();
  let emailSent = false;
  let emailErrorMsg = '';

  if (transporter) {
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
      console.log(`[EMAIL SUCCESS] Письмо успешно отправлено на ${NOTIFICATION_EMAIL}. MessageId: ${info.messageId}`);
    } catch (err: any) {
      console.error(`[EMAIL ERROR] Ошибка отправки на ${NOTIFICATION_EMAIL}:`, err?.message || err);
      emailErrorMsg = err?.message || String(err);
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
