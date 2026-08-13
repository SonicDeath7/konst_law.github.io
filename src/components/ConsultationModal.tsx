import React, { useState, useEffect } from 'react';
import { LAWYER_INFO } from '../data/legalData';
import { X, Shield, ExternalLink, MessageSquare } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
  initialMessage?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'Запись на консультацию',
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIframeLoading(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const yandexFormUrl = 'https://forms.yandex.ru/u/6a7e2f0084227c5c9b2bae67?iframe=1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111a2e] border border-slate-700 rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 pr-10">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>ЯНДЕКС.ФОРМЫ • ОФИЦИАЛЬНАЯ ЗАПИСЬ</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-serif">
              {defaultTopic || 'Запись на консультацию юриста'}
            </h3>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Закрыть окно"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Yandex Form Embed Area */}
        <div className="relative flex-1 w-full min-h-[460px] sm:min-h-[500px] bg-white rounded-2xl overflow-hidden border border-slate-700/60 shadow-inner">
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 space-y-3 z-10">
              <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-medium text-slate-400">Загрузка формы Яндекс...</p>
            </div>
          )}

          <iframe
            src={yandexFormUrl}
            frameBorder="0"
            name="ya-form-6a7e2f0084227c5c9b2bae67"
            width="100%"
            height="100%"
            onLoad={() => setIframeLoading(false)}
            className="w-full h-full min-h-[460px] sm:min-h-[500px] border-0"
            title="Форма записи на консультацию юриста Мирошина К.А."
          />
        </div>

        {/* Modal Footer / Direct Contacts */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span>Или напишите в мессенджер:</span>
            <a
              href={LAWYER_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-semibold"
            >
              WhatsApp
            </a>
            <span>•</span>
            <a
              href={`tel:${LAWYER_INFO.phone}`}
              className="text-amber-400 hover:underline font-semibold"
            >
              {LAWYER_INFO.phoneFormatted}
            </a>
          </div>

          <a
            href="https://forms.yandex.ru/u/6a7e2f0084227c5c9b2bae67/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-slate-400 hover:text-amber-400 transition-colors"
          >
            <span>Открыть форму на весь экран</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
