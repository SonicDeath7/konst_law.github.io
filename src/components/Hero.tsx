import React from 'react';
import { LAWYER_INFO } from '../data/legalData';
import { ArrowUpRight, ShieldCheck, Scale, Award, CheckCircle2, PhoneCall, FileText } from 'lucide-react';

interface HeroProps {
  onOpenConsultationModal: () => void;
  onOpenCalculator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenConsultationModal,
  onOpenCalculator
}) => {
  return (
    <section className="relative pt-6 pb-16 sm:pb-24 px-4 sm:px-8 overflow-hidden">
      {/* Glow Effects Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Trust Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                ИП МИРОШИН К.А.
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Юридический стаж {LAWYER_INFO.experienceYears}+ лет</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-serif">
              Ваш персональный{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                партнёр
              </span>{' '}
              в правовых и арбитражных делах
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Квалифицированная защита интересов индивидуальных предпринимателей, юридических и физических лиц. 
              Аудит договоров, взыскание задолженностей и представительство в арбитражных судах РФ.
            </p>

            {/* Direct Contact Pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Фиксированный гонорар по договору</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Оценка рисков до старта</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenConsultationModal}
                className="px-6 py-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Получить бесплатную консультацию</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-5 py-4 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/90 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Рассчитать стоимость дела</span>
              </button>
            </div>

            {/* Direct Contact Info Box */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Прямая связь с юристом:</span>
                <a
                  href={`tel:${LAWYER_INFO.phone}`}
                  className="text-lg font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center space-x-1"
                >
                  <PhoneCall className="w-4 h-4 mr-1 text-amber-400" />
                  <span>{LAWYER_INFO.phoneFormatted}</span>
                </a>
              </div>

              <div>
                <span className="text-xs text-slate-400 block font-medium">E-mail:</span>
                <a
                  href={`mailto:${LAWYER_INFO.email}`}
                  className="text-sm font-semibold text-slate-200 hover:text-amber-400 transition-colors"
                >
                  {LAWYER_INFO.email}
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={LAWYER_INFO.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <span>Telegram</span>
                </a>
                <a
                  href={LAWYER_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/60 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Portrait Visual & Badges */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex justify-center">
            
            {/* Visual Portrait Frame Container */}
            <div className="relative w-full max-w-md mx-auto">
              
              {/* Outer Decorative Glow Ring */}
              <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 via-slate-700/20 to-amber-500/10 rounded-3xl blur-lg pointer-events-none" />

              <div className="relative bg-[#111a2e] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-2">
                
                {/* Scales of Justice Background Graphic SVG Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Portrait Image */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center group">
                  <img
                    src="images/photo.jpg"
                    alt="Мирошин Константин Алексеевич — Юрист"
                    className="w-full h-full object-cover object-top filter contrast-[1.03]"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-90 pointer-events-none" />

                  {/* Bottom Portrait Name Badge Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-lg pointer-events-none">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white font-serif">
                          Мирошин Константин Алексеевич
                        </p>
                        <p className="text-[11px] text-amber-400 font-medium">
                          Индивидуальный предприниматель • Юрист
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <Scale className="w-4 h-4 text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Hero Bottom Key Metrics Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#131d33]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 hover:border-amber-500/40 transition-all">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-serif">
              14+
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Лет юридической практики</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Опыт в арбитраже и гражданских делах</p>
          </div>

          <div className="bg-[#131d33]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 hover:border-amber-500/40 transition-all">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-serif">
              98%
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Успешных урегулирований</p>
            <p className="text-[11px] text-slate-400 mt-0.5">В судебном и досудебном порядке</p>
          </div>

          <div className="bg-[#131d33]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 hover:border-amber-500/40 transition-all">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-serif">
              350+
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Защищенных клиентов</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Предприниматели, компании и граждане</p>
          </div>

          <div className="bg-[#131d33]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 hover:border-amber-500/40 transition-all">
            <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-serif">
              100%
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Конфиденциальность</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Сохранение тайны по договору NDA</p>
          </div>
        </div>

      </div>
    </section>
  );
};
