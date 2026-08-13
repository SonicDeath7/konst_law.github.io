import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, phone, email, topic, message } = data;

    if (!name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Пожалуйста, укажите имя и телефон.' })
      };
    }

    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'sonicdeath7@yandex.ru';
    const host = process.env.SMTP_HOST || 'smtp.yandex.ru';
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const user = process.env.SMTP_USER || 'sonicdeath7@yandex.ru';
    const pass = process.env.SMTP_PASS || '655e270905f76b04a0c27586d4b64d95';

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8920101288:AAEQhC08geOKnAvWcnvwjtvb0x8dJxCgx3E';
    if (TELEGRAM_BOT_TOKEN) {
      try {
        const tgText = `🔔 <b>Новая заявка с сайта юриста!</b>\n\n` +
          `👤 <b>Имя:</b> ${name}\n` +
          `📞 <b>Телефон:</b> ${phone}\n` +
          `📧 <b>Email:</b> ${email || 'Не указан'}\n` +
          `📋 <b>Тема:</b> ${topic || 'Запись на консультацию'}\n` +
          `💬 <b>Сообщение:</b> ${message || 'Без текста'}`;

        const updatesRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        if (updatesRes.ok) {
          const updatesData: any = await updatesRes.json();
          if (updatesData.ok && Array.isArray(updatesData.result)) {
            for (const item of updatesData.result) {
              const cid = item.message?.chat?.id || item.channel_post?.chat?.id;
              if (cid) {
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ chat_id: cid, parse_mode: 'HTML', text: tgText })
                });
              }
            }
          }
        }
      } catch (tgErr) {
        console.error('Telegram notification error:', tgErr);
      }
    }

    if (user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });

      await transporter.sendMail({
        from: `"Сайт Юриста" <${user}>`,
        to: NOTIFICATION_EMAIL,
        replyTo: email && email.includes('@') ? email : undefined,
        subject: `[Заявка с сайта] ${topic || 'Консультация'}`,
        html: `
          <h2>Новая заявка с сайта юриста</h2>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>E-mail:</strong> ${email || 'Не указан'}</p>
          <p><strong>Тема:</strong> ${topic || 'Запись на консультацию'}</p>
          <p><strong>Сообщение:</strong></p>
          <blockquote style="background: #f4f4f4; padding: 12px; border-left: 3px solid #d4af37;">
            ${message || 'Без комментария'}
          </blockquote>
        `
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        requestId: `net-${Date.now()}`,
        message: 'Заявка успешно принята!'
      })
    };
  } catch (err: any) {
    console.error('Netlify function email error:', err);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        requestId: `net-${Date.now()}`,
        message: 'Заявка принята!'
      })
    };
  }
};
