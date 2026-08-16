import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/legalData';
import { LegalService } from '../types';
import { Scale, ShieldCheck, FileText, Building, Gavel, Handshake, ArrowRight, CheckCircle2, FileQuestion, X, DollarSign } from 'lucide-react';

interface ServicesProps {
  onSelectServiceForConsultation: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForConsultation }) => {
  const [selectedService, setSelectedService] = useState<LegalService | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-6 h-6 text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-amber-400" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-amber-400" />;
      case 'Building':
        return <Building className="w-6 h-6 text-amber-400" />;
      case 'Gavel':
        return <Gavel className="w-6 h-6 text-amber-400" />;
      case 'Handshake':
        return <Handshake className="w-6 h-6 text-amber-400" />;
      default:
        return <Scale className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0d1527] relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <Scale className="w-3.5 h-3.5" />
            <span>ПРАКТИКА И УСЛУГИ ЮРИСТА</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Специализация ИП Мирошин К.А.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Комплексная правовая помощь для бизнеса и частных лиц с гарантией профессионализма и соблюдением процессуальных норм.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="bg-[#111a2e] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-all">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    {service.priceStart}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white font-serif group-hover:text-amber-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {service.shortDesc}
                </p>

                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 font-medium">Для кого:</p>
                  <p className="text-xs text-slate-200 font-medium mt-0.5">{service.targetAudience}</p>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 group/btn cursor-pointer"
                >
                  <span>Подробнее об услуге</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onSelectServiceForConsultation(service.title)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Заказать
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Detail Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111a2e] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                {getIcon(selectedService.iconName)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-serif">{selectedService.title}</h3>
                <span className="text-xs font-bold text-amber-400">{selectedService.priceStart}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedService.fullDesc}
            </p>

            {/* Deliverables */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Что входит в работу юриста:</span>
              </h4>
              <ul className="space-y-2">
                {selectedService.deliverables.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-200 flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documents needed */}
            <div className="space-y-2 bg-[#0a0f1d] p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <FileQuestion className="w-4 h-4 text-amber-400" />
                <span>Какие документы потребуются:</span>
              </h4>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedService.documentsNeeded.map((doc, idx) => (
                  <span key={idx} className="text-[11px] px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700"
              >
                Закрыть
              </button>

              <button
                onClick={() => {
                  const title = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForConsultation(title);
                }}
                className="px-6 py-2.5 text-xs font-bold text-slate-950 btn-amber-glow rounded-xl shadow-lg cursor-pointer"
              >
                Заказать консультацию
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
