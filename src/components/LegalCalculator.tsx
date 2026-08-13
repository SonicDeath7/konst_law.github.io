import React, { useState } from 'react';
import { Calculator, ArrowRight, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface LegalCalculatorProps {
  onApplyEstimate: (category: string, estimate: string) => void;
}

export const LegalCalculator: React.FC<LegalCalculatorProps> = ({ onApplyEstimate }) => {
  const [category, setCategory] = useState('arbitration');
  const [claimAmount, setClaimAmount] = useState('500k-3m');
  const [stage, setStage] = useState('pre-trial');
  const [hasDocs, setHasDocs] = useState('full');

  const calculateEstimate = () => {
    let basePrice = 25000;
    let complexity = 'Средняя сложность';
    let probability = 'Высокая (до 90%)';

    if (category === 'arbitration') {
      if (claimAmount === 'over-3m') basePrice = 65000;
      else if (claimAmount === '500k-3m') basePrice = 45000;
      else basePrice = 30000;
    } else if (category === 'business') {
      basePrice = 35000;
    } else if (category === 'contract') {
      basePrice = 12000;
    } else if (category === 'court') {
      basePrice = 20000;
    }

    if (stage === 'appeal') basePrice += 15000;
    if (hasDocs === 'partial') {
      probability = 'Средняя (требуется истребование доказательств)';
      basePrice += 5000;
    } else if (hasDocs === 'none') {
      probability = 'Требуется восстановление документов';
      basePrice += 10000;
    }

    return {
      priceRange: `от ${basePrice.toLocaleString('ru-RU')} ₽`,
      complexity,
      probability
    };
  };

  const result = calculateEstimate();

  return (
    <section id="calculator" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0b1120] relative">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Section Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <Calculator className="w-3.5 h-3.5" />
            <span>ОНЛАЙН-РАСЧЕТ ДЕЛ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Калькулятор оценки стоимости и перспектив
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            Укажите параметры вашей ситуации, чтобы получить предварительную оценку трудоемкости и ориентировочного гонорара юриста.
          </p>
        </div>

        {/* Calculator Interface Container */}
        <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                1. Категория правового вопроса:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'arbitration', label: 'Арбитражный спор' },
                  { id: 'business', label: 'Защита бизнеса / ИП' },
                  { id: 'contract', label: 'Договоры и аудит' },
                  { id: 'court', label: 'Гражданский суд' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`p-3 text-xs font-semibold rounded-xl text-left border transition-all cursor-pointer ${
                      category === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#0a0f1d] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Claim Amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                2. Сумма иска или спорного имущества:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'under-500k', label: 'До 500 000 ₽' },
                  { id: '500k-3m', label: '500 тыс - 3 млн ₽' },
                  { id: 'over-3m', label: 'Свыше 3 млн ₽' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setClaimAmount(item.id)}
                    className={`p-2.5 text-xs font-semibold rounded-xl text-center border transition-all cursor-pointer ${
                      claimAmount === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#0a0f1d] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Stage */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                3. Текущая стадия конфликта:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pre-trial', label: 'Досудебная (Претензия)' },
                  { id: 'trial', label: 'Первая инстанция' },
                  { id: 'appeal', label: 'Апелляция / Кассация' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStage(item.id)}
                    className={`p-2.5 text-[11px] font-semibold rounded-xl text-center border transition-all cursor-pointer ${
                      stage === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#0a0f1d] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Documents */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                4. Наличие доказательств и документов:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'full', label: 'Полный комплект документов есть' },
                  { id: 'partial', label: 'Частично, часть у контрагента' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHasDocs(item.id)}
                    className={`p-2.5 text-xs font-semibold rounded-xl text-left border transition-all cursor-pointer ${
                      hasDocs === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-[#0a0f1d] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-[#0a0f1d] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Ориентировочный итог:
              </span>

              <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30">
                <span className="text-xs text-slate-400 block font-medium">Предварительный гонорар:</span>
                <span className="text-3xl font-extrabold text-amber-400 font-serif block mt-1">
                  {result.priceRange}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  * Точный расчет утверждается после ознакомления с документами
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Перспектива дела:</span>
                  <span className="text-emerald-400 font-semibold">{result.probability}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Взыскание судебных издержек:</span>
                  <span className="text-slate-200 font-semibold">Да, с ответчика</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Первичный разбор:</span>
                  <span className="text-amber-400 font-semibold">Бесплатно</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onApplyEstimate(category, result.priceRange)}
              className="w-full py-3.5 px-4 font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Зафиксировать расчет и отправить заявку</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
