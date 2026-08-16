import React from 'react';
import { CheckCircle2, PhoneCall, FileText, FileCheck, Trophy, ArrowRight } from 'lucide-react';

interface ProcessSectionProps {
  onOpenConsultationModal: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenConsultationModal }) => {
  const steps = [
    {
      num: '01',
      title: 'Первичный звонок и экспресс-разбор',
      desc: 'Вы оставляете заявку или звоните по номеру +7 920 275 7199. Кратко обсуждаем проблему и определяем первичную подведомственность.',
      icon: PhoneCall
    },
    {
      num: '02',
      title: 'Правовой аудит документов',
      desc: 'Изучение договоров, актов, переписки и судебных прецедентов. Выявление рисков и формирование пошаговой стратегии защиты.',
      icon: FileText
    },
    {
      num: '03',
      title: 'Заключение официального договора',
      desc: 'Фиксация объёма работ, сроков и стоимости в договоре с ИП Мирошиным К.А. Полная прозрачность — без скрытых комиссий.',
      icon: FileCheck
    },
    {
      num: '04',
      title: 'Судебная защита и исполнение',
      desc: 'Составление исков/претензий, личное участие в судебных заседаниях и помощь во взыскании через приставов или банки.',
      icon: Trophy
    }
  ];

  return (
    <section id="process" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0d1527] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ПОРЯДОК ВЗАИМОДЕЙСТВИЯ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            4 шага к решению вашей правовой задачи
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Простой, надежный и понятный процесс работы с гарантией соблюдения профессиональной этики.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#111a2e] border border-slate-800 rounded-2xl p-6 relative flex flex-col justify-between hover:border-amber-500/40 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold font-serif text-amber-500/40 group-hover:text-amber-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-serif">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center text-[11px] font-semibold text-amber-400">
                  <span>Этап {idx + 1} из 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#111c33] via-[#162340] to-[#111c33] border border-slate-700/80 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white font-serif">
              Нужно обсудить ваш вопрос уже сегодня?
            </h3>
            <p className="text-xs text-slate-300">
              Запишитесь на бесплатную первичную экспресс-консультацию прямо сейчас.
            </p>
          </div>

          <button
            onClick={onOpenConsultationModal}
            className="px-6 py-3 text-xs font-bold text-slate-950 btn-amber-glow rounded-xl shadow-lg flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Начать работу с юристом</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
