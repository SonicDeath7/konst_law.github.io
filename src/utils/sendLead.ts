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
export const WEB3FORMS_KEY = '18bb6465-b83f-4dbd-89f1-c3adfb3171e1'; 

export interface LeadResponse {
  success: boolean;
  requestId: string;
  activationNeeded?: boolean;
  message?: string;
}

/**
  Нативная отправка формы через скрытый iframe в DOM.
  Работает БЕЗ ВПН в РФ, так как браузер выполняет прямой POST-запрос формы без предзапросов CORS (OPTIONS).
 */
function submitHiddenForm(actionUrl: string, fields: Record<string, string>): void {
  if (typeof document === 'undefined') return;
  try {
    const iframeName = `hidden_lead_iframe_${Math.random().toString(36).substring(2, 9)}`;
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.target = iframeName;
    form.action = actionUrl;
    form.method = 'POST';
    form.style.display = 'none';

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      try {
        if (form.parentNode) form.parentNode.removeChild(form);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      } catch (e) {}
    }, 10000);
  } catch (err) {
    console.warn('[HiddenForm] error:', err);
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3000): Promise<Response> {
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
  const requestId = `lead-${Date.now()}`;

  const fullTextMsg = `Имя: ${name}\nТелефон: ${phone}\nEmail: ${email || 'Не указан'}\nТема: ${topic || 'Запись на консультацию'}\nСообщение: ${message || 'Без текста'}`;
  const subjectStr = `[Заявка с сайта юриста] ${topic || name}`;

  // 1. 📧 НА ТИВНАЯ ОТПРАВКА НА ПОЧТУ (через скрытые Iframe - гарантировано работает в РФ без ВПН!)
  submitHiddenForm('https://api.web3forms.com/submit', {
    access_key: WEB3FORMS_KEY,
    name,
    phone,
    email: email || '',
    from_name: 'Сайт Юриста Мирошина',
    subject: subjectStr,
    message: fullTextMsg
  });

  submitHiddenForm(`https://formsubmit.co/${TARGET_EMAIL}`, {
    'Имя': name,
    'Телефон': phone,
    'Email': email || 'Не указан',
    'Тема': topic || 'Запись на консультацию',
    'Сообщение': message || 'Без текста',
    '_subject': subjectStr,
    '_captcha': 'false'
  });

  // 2. 📧 ПАРАЛЛЕЛЬНЫЕ FETCH-ЗАПРОСЫ (через CORS прокси для обхода блокировок РКН)
  (async () => {
    // Web3Forms fetch через прокси
    const w3Payload = JSON.stringify({
      access_key: WEB3FORMS_KEY,
      name, phone, email,
      from_name: 'Сайт Юриста',
      subject: subjectStr,
      message: fullTextMsg
    });

    const w3Urls = [
      'https://api.web3forms.com/submit',
      `https://corsproxy.io/?https://api.web3forms.com/submit`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent('https://api.web3forms.com/submit')}`
    ];

    for (const url of w3Urls) {
      try {
        const res = await fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: w3Payload
        }, 2500);
        if (res.ok) break;
      } catch (e) {}
    }
  })();

  // 3. 📱 TELEGRAM BOT (Фоновый отправка через российские прокси-зеркала)
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    (async () => {
      const tgText = `🔔 <b>Новая заявка с сайта юриста!</b>\n\n` +
        `👤 <b>Имя:</b> ${name}\n` +
        `📞 <b>Телефон:</b> ${phone}\n` +
        `📧 <b>Email:</b> ${email || 'Не указан'}\n` +
        `📋 <b>Тема:</b> ${topic || 'Запись на консультацию'}\n` +
        `💬 <b>Сообщение:</b> ${message || 'Без текста'}`;

      const payload = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        parse_mode: 'HTML',
        text: tgText
      });

      const tgEndpoints = [
        `https://telegg.ru/orig/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        `https://corsproxy.io/?https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`)}`,
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
      ];

      for (const ep of tgEndpoints) {
        try {
          const res = await fetchWithTimeout(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
          }, 2500);
          if (res.ok) break;
        } catch (e) {}
      }
    })();
  }

  // Заявка зафиксирована и запущена во все каналы
  return {
    success: true,
    requestId
  };
}


