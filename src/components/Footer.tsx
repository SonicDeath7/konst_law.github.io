import React from 'react';
import { LAWYER_INFO } from '../data/legalData';
import { Scale, ArrowUp, Phone, Mail, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070b16] border-t border-slate-800/80 text-slate-400 py-12 px-4 sm:px-8 text-xs relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white font-serif block">
                ИП Мирошин Константин Алексеевич
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                Юрист по арбитражным и гражданским делам
              </span>
            </div>
          </div>

          {/* Quick Contacts */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href={`tel:${LAWYER_INFO.phone}`}
              className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 font-medium text-slate-200"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{LAWYER_INFO.phoneFormatted}</span>
            </a>
            <a
              href={`mailto:${LAWYER_INFO.email}`}
              className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 text-slate-300"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{LAWYER_INFO.email}</span>
            </a>
          </div>

          {/* Scroll Top */}
          <button
            onClick={scrollToTop}
            className="p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>Наверх</span>
            <ArrowUp className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Legal Disclaimers & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-300">
          <p>© {new Date().getFullYear()} ИП Мирошин К.А. Все права защищены. ОГРНИП {LAWYER_INFO.ogrnip}</p>
          <p className="text-center sm:text-right text-slate-300">
            Информация на сайте не является публичной офертой (ст. 437 ГК РФ).
          </p>
        </div>

      </div>
    </footer>
  );
};
