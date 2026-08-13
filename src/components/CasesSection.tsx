import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/legalData';
import { Award, CheckCircle, ChevronRight, Scale, TrendingUp } from 'lucide-react';

export const CasesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Все');

  const categories = ['Все', 'Арбитраж', 'Защита бизнеса', 'Недвижимость'];

  const filteredCases = activeCategory === 'Все'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(c => c.category === activeCategory);

  return (
    <section id="cases" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0b1120] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <Award className="w-3.5 h-3.5" />
            <span>СУДЕБНАЯ ПРАКТИКА И КЕЙСЫ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Результаты защиты клиентов
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Примеры успешно завершенных арбитражных споров, урегулированных налоговых претензий и защищенных активов.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCases.map((item) => (
            <div
              key={item.id}
              className="bg-[#111c33] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-amber-500/40 transition-all shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    {item.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.clientType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-serif leading-snug">
                  {item.title}
                </h3>

                <div className="p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    Сумма иска / предмета спора:
                  </span>
                  <p className="text-xl font-extrabold text-amber-400 font-serif">
                    {item.claimAmount}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Steps */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 block">Ключевые действия:</span>
                  {item.keySteps.map((step, idx) => (
                    <div key={idx} className="text-[11px] text-slate-400 flex items-start space-x-1.5">
                      <ChevronRight className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result Box */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Результат:</span>
                  <span className="text-[11px] text-emerald-200">{item.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
