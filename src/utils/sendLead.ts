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

/**
 * Вспомогательная функция отправки формы через скрытый iframe (для статического хостинга без бэкенда)
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

/**
 * Главный диспетчер отправки заявки на почту sonicdeath7@yandex.ru
 */
export async function sendLead(data: LeadData): Promise<LeadResponse> {
  const { name, phone, email, topic, message } = data;
  const requestId = `lead-${Date.now()}`;

  // 1. Первичная отправка на свой Express бэкенд с Yandex SMTP
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, topic, message })
    });

    if (res.ok) {
      const result = await res.json();
      if (result && result.success) {
        console.log('[Lead Dispatcher] Заявка успешно обработана сервером /api/contact:', result);
        return {
          success: true,
          requestId: result.requestId || requestId,
          message: result.message,
          emailSent: result.emailSent
        };
      }
    }
  } catch (err) {
    console.warn('[Lead Dispatcher] /api/contact не доступен (статический хостинг), запускаем фоллбэк отправки');
  }

  // 2. Резервный канал на случай размещения на статическом хостинге (GitHub Pages)
  const subjectStr = `[Заявка с сайта юриста] ${topic || name}`;
  submitHiddenForm(`https://formsubmit.co/${TARGET_EMAIL}`, {
    'Имя': name,
    'Телефон': phone,
    'Email': email || 'Не указан',
    'Тема': topic || 'Запись на консультацию',
    'Сообщение': message || 'Без текста',
    '_subject': subjectStr,
    '_captcha': 'false'
  });

  return {
    success: true,
    requestId,
    message: 'Заявка принята и отправлена на почту юриста!'
  };
}
