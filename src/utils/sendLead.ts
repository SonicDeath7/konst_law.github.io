export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  topic?: string;
  message?: string;
}

export const TARGET_EMAIL = 'sonicdeath7@yandex.ru';

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
 * Диспетчер отправки заявки через защищенный российский бэкенд (Яндекс.Почта)
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
  let responseMessage = 'Заявка успешно принята! Юрист свяжется с вами в ближайшее время.';

  // Отправка через локальный Node.js бэкенд /api/contact (Яндекс SMTP)
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
        if (result.message) {
          responseMessage = result.message;
        }
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      console.warn('[Lead Dispatcher] Ошибка сервера:', errJson);
    }
  } catch (err) {
    console.warn('[Lead Dispatcher] Ошибка запроса к /api/contact:', err);
  }

  return {
    success: true,
    requestId,
    emailSent,
    message: responseMessage
  };
}

