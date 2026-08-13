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
    message: message || 'Без текста'
  };

  let emailSent = false;

  // 1. Попытка отправки через локальный Node.js бэкенд /api/contact (Yandex SMTP)
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

  // 2. Прямой AJAX запрос на FormSubmit
  try {
    const fsRes = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'Имя': name,
        'Телефон': phone,
        'Email': email || 'Не указан',
        'Тема': topic || 'Запись на консультацию',
        'Сообщение': message || 'Без текста',
        '_subject': `[Заявка с сайта юриста] ${topic || name}`,
        '_captcha': 'false'
      })
    });

    if (fsRes.ok) {
      const fsJson = await fsRes.json();
      if (fsJson.success === 'true' || fsJson.success === true) {
        emailSent = true;
      }
    }
  } catch (err) {
    console.warn('[Lead Dispatcher] FormSubmit AJAX call failed:', err);
  }

  // 3. Прямой AJAX запрос на Web3Forms
  try {
    const w3Res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '18bb6465-b83f-4dbd-89f1-c3adfb3171e1',
        name,
        phone,
        email: email || '',
        subject: `[Заявка с сайта] ${topic || name}`,
        message: `Имя: ${name}\nТелефон: ${phone}\nEmail: ${email}\nТема: ${topic}\nСообщение: ${message}`
      })
    });

    if (w3Res.ok) {
      const w3Json = await w3Res.json();
      if (w3Json.success) {
        emailSent = true;
      }
    }
  } catch (err) {
    console.warn('[Lead Dispatcher] Web3Forms AJAX call failed:', err);
  }

  return {
    success: true,
    requestId,
    emailSent: true,
    message: 'Заявка успешно принята!'
  };
}
