export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  topic?: string;
  message?: string;
}

export const TARGET_EMAIL = 'sonicdeath7@yandex.ru';

// Вы можете вставить сюда Web App URL от Google Apps Script, если создали его
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxs-arJaFBZZNYjmel8aMgFmwQhKv0SBkL3Ejbd9vrKq11OmoTzIqvKrd0sZ91K0ie-/exec';

export interface LeadResponse {
  success: boolean;
  requestId: string;
  message?: string;
  emailSent?: boolean;
}

export function getMailtoLink(data: LeadData): string {
  const subject = encodeURIComponent(`[Заявка с сайта юриста] ${data.topic || 'Консультация'} — ${data.name}`);
  const body = encodeURIComponent(
    `Новая заявка с сайта юриста:\n\n` +
    `Имя: ${data.name}\n` +
    `Телефон: ${data.phone}\n` +
    `Email: ${data.email || 'Не указан'}\n` +
    `Тема: ${data.topic || 'Запись на консультацию'}\n\n` +
    `Сообщение:\n${data.message || 'Без текста'}\n\n` +
    `--- Отправлено с сайта юриста Мирошина К.А.`
  );
  return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
}

/**
 * Диспетчер отправки заявки
 */
export async function sendLead(data: LeadData): Promise<LeadResponse> {
  const { name, phone, email, topic, message } = data;
  const requestId = `lead-${Date.now()}`;

  const payload = {
    name,
    phone,
    email: email || 'Не указан',
    topic: topic || 'Запись на консультацию',
    message: message || 'Без текста',
    timestamp: new Date().toISOString()
  };

  let emailSent = false;

  // 1. Попытка отправки через локальный Node.js бэкенд /api/contact
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const result = await res.json();
      if (result && result.success) {
        console.log('[Lead Dispatcher] Ответ /api/contact:', result);
        emailSent = Boolean(result.emailSent);
      }
    }
  } catch (err) {
    console.warn('[Lead Dispatcher] /api/contact call failed:', err);
  }

  // 2. Прямой вызов Resend API с клиента
  const RESEND_API_KEY = 're_V2SjcetA_LBCieiWXoe3wkEdspcuRSvMP';
  if (!emailSent) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Сайт Юриста <onboarding@resend.dev>',
          to: ['sonicdeath7@yandex.ru', 'darkbeacon71@gmail.com'],
          subject: `[Заявка с сайта] ${topic || 'Консультация'} — ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>🔔 Новая заявка с сайта юриста</h2>
              <p><b>Имя:</b> ${name}</p>
              <p><b>Телефон:</b> ${phone}</p>
              <p><b>Email:</b> ${email || 'Не указан'}</p>
              <p><b>Тема:</b> ${topic || 'Запись на консультацию'}</p>
              <p><b>Сообщение:</b> ${message || 'Без текста'}</p>
            </div>
          `
        })
      });
      if (resendRes.ok) {
        emailSent = true;
        console.log('[Lead Dispatcher] Заявка успешно отправлена через Resend API с клиента');
      }
    } catch (err) {
      console.warn('[Lead Dispatcher] Direct Resend API call failed:', err);
    }
  }

  // 3. Отправка через Google Apps Script
  if (GOOGLE_SCRIPT_URL) {
    try {
      const qParams = new URLSearchParams({
        name,
        phone,
        email: email || 'Не указан',
        topic: topic || 'Запись на консультацию',
        message: message || 'Без текста'
      });
      
      await fetch(`${GOOGLE_SCRIPT_URL}?${qParams.toString()}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      emailSent = true;
      console.log('[Lead Dispatcher] Заявка успешно отправлена в Google Apps Script');
    } catch (err) {
      console.warn('[Lead Dispatcher] Google Script call failed:', err);
    }
  }

  return {
    success: true,
    requestId,
    emailSent,
    message: 'Заявка успешно отправлена!'
  };
}
