export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  topic?: string;
  message?: string;
}

export const TARGET_EMAIL = 'sonicdeath7@yandex.ru';
export const TELEGRAM_BOT_TOKEN = '8920101288:AAEQhC08geOKnAvWcnvwjtvb0x8dJxCgx3E';
export const TELEGRAM_CHAT_ID = '226821933';

export interface LeadResponse {
  success: boolean;
  requestId: string;
  message?: string;
}

/**
 * Диспетчер отправки заявки напрямую на бэкенд /api/contact (Yandex SMTP)
 */
export async function sendLead(data: LeadData): Promise<LeadResponse> {
  const { name, phone, email, topic, message } = data;
  const requestId = `lead-${Date.now()}`;

  // 1. Прямая отправка на серверную почту Яндекс (/api/contact)
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, topic, message })
    });

    if (res.ok) {
      const result = await res.json();
      if (result && result.success) {
        return {
          success: true,
          requestId: result.requestId || requestId,
          message: result.message
        };
      }
    }
  } catch (err) {
    console.warn('[Lead Dispatcher] /api/contact call failed:', err);
  }

  // 2. Прямой вызов Telegram API (резервный)
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    (async () => {
      try {
        const tgText = `🔔 <b>Новая заявка с сайта юриста!</b>\n\n` +
          `👤 <b>Имя:</b> ${name}\n` +
          `📞 <b>Телефон:</b> ${phone}\n` +
          `📧 <b>Email:</b> ${email || 'Не указан'}\n` +
          `📋 <b>Тема:</b> ${topic || 'Запись на консультацию'}\n` +
          `💬 <b>Сообщение:</b> ${message || 'Без текста'}`;

        const encodedText = encodeURIComponent(tgText);
        const directTgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&parse_mode=HTML&text=${encodedText}`;

        const proxyUrls = [
          `https://api.allorigins.win/raw?url=${encodeURIComponent(directTgUrl)}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(directTgUrl)}`,
          directTgUrl
        ];

        for (const url of proxyUrls) {
          try {
            const r = await fetch(url, { method: 'GET', mode: 'cors' });
            if (r.ok) break;
          } catch (e) {}
        }
      } catch (e) {}
    })();
  }

  return {
    success: true,
    requestId
  };
}
