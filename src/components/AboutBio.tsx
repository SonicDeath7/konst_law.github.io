import React from 'react';
import { LAWYER_INFO } from '../data/legalData';
import { Shield, Award, CheckCircle, FileCheck2, UserCheck, Briefcase } from 'lucide-react';

export const AboutBio: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0b1120] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span>ОБ ИНДИВИДУАЛЬНОМ ПРЕДПРИНИМАТЕЛЕ И ЮРИСТЕ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Мирошин Константин Алексеевич
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Практикующий юрист с высшим профильным юридическим образованием и 20-летним опытом судебного представительства и правового сопровождения бизнеса.
          </p>
        </div>

        {/* 2-Column Main Bio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Bio Highlights */}
          <div className="lg:col-span-7 bg-[#111c33] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-serif flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <span>Профессиональный подход и статус</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Статус Индивидуального Предпринимателя (ИП Мирошин К.А.) обеспечивает клиентам прозрачное договорное взаимодействие с возможностью отнести расходы на юридические услуги к судебным и налоговым вычетам.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                Специализируюсь на разрешении сложнейших арбитражных споров между юридическими лицами, защите интересов малого и среднего бизнеса, комплексном аудите договоров и представлении интересов граждан в судах общей юрисдикции.
              </p>
            </div>

            {/* Official Credentials Box */}
            <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Статус:</span>
                <span className="text-slate-200 font-semibold">{LAWYER_INFO.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">ОГРНИП / ИНН:</span>
                <span className="text-slate-200 font-semibold">{LAWYER_INFO.ogrnip} / {LAWYER_INFO.inn}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Юридический стаж:</span>
                <span className="text-amber-400 font-semibold">{LAWYER_INFO.experienceYears}+ лет</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">География работы:</span>
                <span className="text-slate-200 font-semibold">Москва, Тула, РФ (ЭДО/ВКС)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Principles */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#111a2e] to-[#0c1324] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white font-serif flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Принципы моей работы</span>
              </h3>
              <p className="text-xs text-slate-400">
                Каждое дело строится на фундаменте строгой законности, финансовой честности и максимальной вовлеченности:
              </p>
            </div>

            <div className="space-y-3">
              {LAWYER_INFO.principles.map((item, idx) => (
                <div key={idx} className="p-3 bg-[#0a0f1d]/80 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
