import React, { useState } from 'react';
import { LAWYER_INFO } from '../data/legalData';
import { Phone, Mail, ShieldCheck, Building, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  initialTopic?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = () => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const yandexFormUrl = 'https://forms.yandex.ru/u/6a7e3a1302848f6ab9df895b?iframe=1';

  return (
    <section id="contacts" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0b1120] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <Phone className="w-3.5 h-3.5" />
            <span>КОНТАКТНАЯ ИНФОРМАЦИЯ & ЗАПИСЬ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Свяжитесь с юристом
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Получите профессиональную первичную консультацию. Направьте ваш вопрос через форму или позвоните напрямую.
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

            {/* Guarantee Badge */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-start space-x-3 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p>
                Вся переданная информация охраняется законом о конфиденциальности и профессиональной тайне юриста.
              </p>
            </div>

          </div>

          {/* Right Column: Yandex Form Embed */}
          <div className="lg:col-span-7 bg-[#111c33] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ЯНДЕКС.ФОРМЫ</span>
                </div>
                <h3 className="text-xl font-bold text-white font-serif">
                  Онлайн-заявка на консультацию
                </h3>
              </div>

              <a
                href="https://forms.yandex.ru/u/6a7e3a1302848f6ab9df895b/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-amber-400 transition-colors"
              >
                <span>Открыть на весь экран</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-slate-300">
              Заполните поля формы ниже. Заявка моментально поступит юристу, и Константин Алексеевич свяжется с вами в течение 15–30 минут.
            </p>

            {/* Embedded Yandex Form Container */}
            <div className="relative w-full min-h-[520px] bg-white rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner">
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 space-y-3 z-10">
                  <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-medium text-slate-400">Загрузка Яндекс.Формы...</p>
                </div>
              )}

              <iframe
                src={yandexFormUrl}
                frameBorder="0"
                name="ya-form-6a7e3a1302848f6ab9df895b"
                width="100%"
                height="560"
                onLoad={() => setIframeLoading(false)}
                className="w-full min-h-[520px] border-0"
                title="Яндекс Форма записи к юристу Мирошину К.А."
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
