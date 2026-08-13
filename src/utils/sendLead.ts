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

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Universal Lead Dispatcher
 */
export async function sendLead(data: LeadData): Promise<LeadResponse> {
  const { name, phone, email, topic, message } = data;
  const fallbackId = `req-${Date.now()}`;
  let emailDelivered = false;

  // 📧 Канал 1 (ОСНОВНОЙ): Прямая отправка на Email (sonicdeath7@yandex.ru) через Web3Forms
  if (WEB3FORMS_KEY) {
    try {
      const w3Payload: Record<string, string> = {
        access_key: WEB3FORMS_KEY,
        name: name,
        phone: phone,
        from_name: 'Сайт Юриста Мирошина',
        subject: `[Заявка с сайта юриста] ${topic || name}`,
        topic: topic || 'Запись на консультацию',
        message: `Имя: ${name}\nТелефон: ${phone}\nEmail: ${email || 'Не указан'}\nТема: ${topic || 'Запись на консультацию'}\nСообщение: ${message || 'Без текста'}`
      };

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
          console.log('[Lead Dispatcher] Email delivered to Yandex via Web3Forms!');
          emailDelivered = true;
        }
      }
    } catch (err) {
      console.warn('[Lead Dispatcher] Web3Forms exception:', err);
    }
  }

  // 📧 Канал 2 (Резервный Email): FormSubmit.co напрямую на sonicdeath7@yandex.ru
  if (!emailDelivered) {
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
          'Email клиента': email || 'Не указан',
          'Тема': topic || 'Запись на юридическую консультацию',
          'Сообщение': message || 'Без текста сообщения',
          '_subject': `[Новая заявка с сайта юриста] ${topic || name}`,
          '_captcha': 'false',
          '_template': 'table'
        })
      });

      if (fsRes.ok) {
        const fsData = await fsRes.json();
        if (fsData.success === 'true' || fsData.success === true) {
          console.log('[Lead Dispatcher] Email delivered to Yandex via FormSubmit!');
          emailDelivered = true;
        }
      }
    } catch (err) {
      console.warn('[Lead Dispatcher] FormSubmit notice:', err);
    }
  }

  // 📱 Канал Telegram (Фоновый, не блокирует клиента при отсутствии VPN в РФ)
  if (TELEGRAM_BOT_TOKEN) {
    (async () => {
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

        const telegramEndpoints = [
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          `https://telegg.ru/orig/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          `https://corsproxy.io/?https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
        ];

        for (const cid of targetChatIds) {
          for (const endpoint of telegramEndpoints) {
            try {
              const res = await fetchWithTimeout(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: cid, parse_mode: 'HTML', text: tgText })
              }, 2000);
              if (res.ok) break;
            } catch (e) {
              // Игнорируем блокировки Telegram в РФ
            }
          }
        }
      } catch (err) {
        // Фоновая отправка в TG
      }
    })();
  }

  // Если попытка через бэкенд Express /api/contact доступна (для локального сервера)
  try {
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, topic, message })
    }).catch(() => {});
  } catch (err) {}

  return {
    success: true,
    requestId: emailDelivered ? `email-${Date.now()}` : fallbackId
  };
}

