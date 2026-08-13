import React, { useState } from 'react';
import { TESTIMONIALS, FAQ_ITEMS } from '../data/legalData';
import { Star, MessageSquareQuote, HelpCircle, ChevronDown, ChevronUp, Quote } from 'lucide-react';

export const ReviewsFAQ: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? '' : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0d1527] relative">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Testimonials Block */}
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>ОТЗЫВЫ ДОВЕРИТЕЛЕЙ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
              Что говорят клиенты о работе юриста
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#111a2e] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all shadow-xl relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400 space-x-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {rev.caseType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{rev.clientName}</h4>
                    <p className="text-[11px] text-slate-400">{rev.clientRole}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion Block */}
        <div className="max-w-4xl mx-auto space-y-8 pt-8 border-t border-slate-800/80">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ВОПРОСЫ И ОТВЕТЫ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              Часто задаваемые вопросы
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-[#111c33] border border-slate-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white font-serif">
                      {item.question}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
