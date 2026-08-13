import React, { useState } from 'react';
import { LAWYER_INFO } from '../data/legalData';
import { Phone, Mail, Send, CheckCircle2, ShieldCheck, MapPin, Building, Clock, AlertCircle } from 'lucide-react';
import { sendLead } from '../utils/sendLead';

interface ContactSectionProps {
  initialTopic?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialTopic = '' }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(initialTopic || 'Запись на консультацию');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Пожалуйста, укажите ваше имя и контактный телефон.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await sendLead({ name, phone, email, topic, message });
      setSubmittedId(res.requestId);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setErrorMsg('Ошибка подключения к серверу. Попробуйте позвонить по номеру +7 920 275 7199.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacts" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0b1120] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <Phone className="w-3.5 h-3.5" />
            <span>КОНТАКТНАЯ ИНФОРМАЦИЯ & ОБРАТНАЯ СВЯЗЬ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Свяжитесь с юристом
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Получите профессиональную первичную консультацию. Направьте ваш вопрос или назначьте встречу.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contacts & Requisites */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phone & Email Cards */}
            <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white font-serif">
                Прямые контакты
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${LAWYER_INFO.phone}`}
                  className="p-4 bg-[#0a0f1d] border border-slate-800 hover:border-amber-500/50 rounded-2xl flex items-center space-x-4 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Телефон для связи:</span>
                    <span className="text-lg font-bold text-amber-400 font-serif block group-hover:text-amber-300">
                      {LAWYER_INFO.phoneFormatted}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Звонки, Telegram, WhatsApp</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${LAWYER_INFO.email}`}
                  className="p-4 bg-[#0a0f1d] border border-slate-800 hover:border-amber-500/50 rounded-2xl flex items-center space-x-4 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium block">Электронная почта:</span>
                    <span className="text-base font-bold text-slate-100 font-serif block group-hover:text-amber-400">
                      {LAWYER_INFO.email}
                    </span>
                    <span className="text-[10px] text-slate-400">Для документов и договоров</span>
                  </div>
                </a>
              </div>

              {/* Messengers Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={LAWYER_INFO.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl text-center text-xs font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <span>Написать в Telegram</span>
                </a>
                <a
                  href={LAWYER_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-emerald-950/50 border border-emerald-800/80 hover:bg-emerald-900/60 text-emerald-300 rounded-xl text-center text-xs font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <span>Написать в WhatsApp</span>
                </a>
              </div>

            </div>

            {/* IP Requisites Card */}
            <div className="bg-[#111a2e] border border-slate-800 rounded-3xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <Building className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Реквизиты ИП:
                </h4>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                <p><span className="text-slate-400">Наименование:</span> ИП Мирошин Константин Алексеевич</p>
                <p><span className="text-slate-400">ОГРНИП:</span> {LAWYER_INFO.ogrnip}</p>
                <p><span className="text-slate-400">ИНН:</span> {LAWYER_INFO.inn}</p>
                <p><span className="text-slate-400">Формат работы:</span> Очно (г. Тула / г. Москва) и дистанционно (ЭДО) по РФ</p>
              </div>
            </div>

          </div>

          {/* Right Column: Feedback Form */}
          <div className="lg:col-span-7 bg-[#111c33] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-serif">
                Форма записи на консультацию
              </h3>
              <p className="text-xs text-slate-300">
                Заполните форму ниже. Константин Алексеевич изучит детали и свяжется с вами в течение 15–30 минут.
              </p>
            </div>

            {submittedId ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-800 rounded-2xl space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white font-serif">Заявка успешно отправлена!</h4>
                <p className="text-xs text-emerald-200">
                  Номер вашего обращения: <span className="font-mono font-bold text-amber-400">{submittedId}</span>
                </p>
                <p className="text-xs text-slate-300">
                  Юрист Мирошин Константин Алексеевич свяжется с вами по указанному телефону в ближайшее время.
                </p>

                <div className="pt-2 border-t border-emerald-900/60 space-y-2">
                  <p className="text-[11px] text-slate-400">Нужен срочный ответ прямо сейчас?</p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <a
                      href={LAWYER_INFO.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>Написать в WhatsApp</span>
                    </a>
                    <a
                      href={`tel:${LAWYER_INFO.phone}`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{LAWYER_INFO.phone}</span>
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => setSubmittedId(null)}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:brightness-110 rounded-xl cursor-pointer"
                >
                  Отправить еще одно сообщение
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Ваше имя / Компания *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван Петров (ООО «Вектор»)"
                      required
                      className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Телефон для связи *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      required
                      className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      E-mail (для ответа / расчета)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@mail.ru"
                      className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Тема / Тема услуги
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Арбитражный спор, составление договора..."
                      className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Краткое описание вопроса:
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Опишите суть спора, наличие договора, сумму претензий и ожидаемый результат..."
                    rows={4}
                    className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ваши данные строго конфиденциальны (NDA)</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 disabled:opacity-50 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Отправка...' : 'Отправить заявку'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
