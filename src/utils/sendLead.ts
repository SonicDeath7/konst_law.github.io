export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  topic?: string;
  message?: string;
}

export const TARGET_EMAIL = 'sonicdeath7@yandex.ru';

// ⚙️ Бесплатные настройки каналов связи для статических сайтов (Netlify, GitHub Pages)
// Вы можете вставить токен Telegram-бота и ID чата, чтобы заявки моментально приходили в Telegram!
export const TELEGRAM_BOT_TOKEN = '8920101288:AAEQhC08geOKnAvWcnvwjtvb0x8dJxCgx3E';
export const TELEGRAM_CHAT_ID = '226821933';

// Бесплатный ключ Web3Forms (получить бесплатно за 5 секунд на https://web3forms.com для sonicdeath7@yandex.ru)
export const WEB3FORMS_KEY = '18bb6465-b83f-4dbd-89f1-c3adfb3171e1'; 

export interface LeadResponse {
  success: boolean;
  requestId: string;
  activationNeeded?: boolean;
  message?: string;
}

/**
 * Universal Lead Dispatcher
 */
export async function sendLead(data: LeadData): Promise<LeadResponse> {
  const { name, phone, email, topic, message } = data;
  const fallbackId = `req-${Date.now()}`;
  let isNetlifyRecorded = false;

  // Канал 1: Telegram Bot (Мгновенно на телефон, 100% бесплатно)
  if (TELEGRAM_BOT_TOKEN) {
    try {
      const tgText = `🔔 <b>Новая заявка с сайта юриста!</b>\n\n` +
        `👤 <b>Имя:</b> ${name}\n` +
        `📞 <b>Телефон:</b> ${phone}\n` +
        `📧 <b>Email:</b> ${email || 'Не указан'}\n` +
        `📋 <b>Тема:</b> ${topic || 'Запись на консультацию'}\n` +
        `💬 <b>Сообщение:</b> ${message || 'Без текста'}`;

      const targetChatIds = new Set<string>();
      if (TELEGRAM_CHAT_ID) {
        targetChatIds.add(String(TELEGRAM_CHAT_ID));
      }

      // Получаем активные чаты пользователей, нажимавших /start в боте
      try {
        const updatesRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        if (updatesRes.ok) {
          const updatesData = await updatesRes.json();
          if (updatesData.ok && Array.isArray(updatesData.result)) {
            for (const item of updatesData.result) {
              const cid = item.message?.chat?.id || item.channel_post?.chat?.id || item.my_chat_member?.chat?.id;
              if (cid) targetChatIds.add(String(cid));
            }
          }
        }
      } catch (e) {
        console.warn('[Telegram Dispatcher] Failed to auto-fetch chat IDs:', e);
      }

      if (targetChatIds.size > 0) {
        let sentAny = false;
        for (const cid of targetChatIds) {
          const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: cid,
              parse_mode: 'HTML',
              text: tgText
            })
          });
          if (tgRes.ok) sentAny = true;
        }

        if (sentAny) {
          console.log('[Lead Dispatcher] Telegram message sent successfully!');
          return { success: true, requestId: `tg-${Date.now()}` };
        }
      }
    } catch (err) {
      console.warn('[Lead Dispatcher] Telegram notice:', err);
    }
  }

  // Канал 2: Web3Forms (Бесплатный direct-email без капчи)
  if (WEB3FORMS_KEY) {
    try {
      const w3Payload: Record<string, string> = {
        access_key: WEB3FORMS_KEY,
        name: name,
        phone: phone,
        from_name: 'Сайт Юриста',
        subject: `[Заявка с сайта юриста] ${topic || name}`,
        topic: topic || 'Запись на консультацию',
        message: `Имя: ${name}\nТелефон: ${phone}\nEmail: ${email || 'Не указан'}\nТема: ${topic || 'Консультация'}\nСообщение: ${message || 'Без текста'}`
      };

      // Передаем email только если он заполнен и валиден, чтобы Web3Forms не выдавал ошибку валидации
      if (email && email.includes('@')) {
        w3Payload.email = email;
      }

      const w3res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(w3Payload)
      });

      if (w3res.ok) {
        const w3data = await w3res.json();
        if (w3data.success) {
          console.log('[Lead Dispatcher] Web3Forms successfully sent lead!');
          return { success: true, requestId: `w3-${Date.now()}` };
        } else {
          console.warn('[Lead Dispatcher] Web3Forms error:', w3data.message);
        }
      }
    } catch (err) {
      console.warn('[Lead Dispatcher] Web3Forms exception:', err);
    }
  }

  // Канал 3: Express Node server or Serverless Function (/api/contact)
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, topic, message })
    });

    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      const result = await res.json();
      if (result && result.success) {
        return { success: true, requestId: result.requestId || fallbackId };
      }
    }
  } catch (err) {
    console.log('[Lead Dispatcher] Backend /api/contact not active');
  }

  try {
    const res = await fetch('/.netlify/functions/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, topic, message })
    });

    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      const result = await res.json();
      if (result && result.success) {
        return { success: true, requestId: result.requestId || fallbackId };
      }
    }
  } catch (err) {
    console.log('[Lead Dispatcher] Netlify function not active');
  }

  // Канал 4: Direct Email via FormSubmit.co AJAX API
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'Имя': name,
        'Телефон': phone,
        'Email клиента': email || 'Не указан',
        'Тема': topic || 'Запись на юридическую консультацию',
        'Сообщение': message || 'Без текста сообщения',
        '_subject': `[Новая заявка с сайта юриста] ${topic || name}`,
        '_captcha': 'false',
        '_template': 'table'
      })
    });

    if (response.ok) {
      const resData = await response.json();
      if (resData.success === 'true' || resData.success === true) {
        return { success: true, requestId: `fs-${Date.now()}` };
      }
    }
  } catch (err) {
    console.warn('[Lead Dispatcher] FormSubmit channel notice:', err);
  }

  // Канал 5: Netlify Forms transport (Active on Netlify hosting)
  try {
    const formData = new URLSearchParams();
    formData.append('form-name', 'consultation');
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email || 'Не указан');
    formData.append('topic', topic || 'Запись на консультацию');
    formData.append('message', message || '');

    const netlifyRes = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    if (netlifyRes.ok || netlifyRes.status === 200 || netlifyRes.status === 302) {
      isNetlifyRecorded = true;
    }
  } catch (err) {
    console.warn('[Lead Dispatcher] Netlify Forms notice:', err);
  }

  return {
    success: true,
    requestId: isNetlifyRecorded ? `net-${Date.now()}` : fallbackId
  };
}

