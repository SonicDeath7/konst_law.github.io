import React, { useState, useEffect } from 'react';
import { LAWYER_INFO } from '../data/legalData';
import { X, Phone, Send, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { sendLead } from '../utils/sendLead';

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
  initialMessage = ''
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(defaultTopic);
  const [message, setMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmittedId(null);
      setErrorMsg(null);
      setTopic(defaultTopic);
      setMessage(initialMessage);
    }
  }, [isOpen, defaultTopic, initialMessage]);

  const handleClose = () => {
    setSubmittedId(null);
    setErrorMsg(null);
    setName('');
    setPhone('');
    setEmail('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Укажите ваше имя и контактный телефон.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await sendLead({ name, phone, email, topic, message });
      setSubmittedId(res.requestId);
    } catch (err) {
      setErrorMsg('Ошибка отправки. Позвоните напрямую по номеру +7 920 275 7199.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111a2e] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20">
            <Shield className="w-3.5 h-3.5" />
            <span>ИП МИРОШИН К.А.</span>
          </div>
          <h3 className="text-xl font-bold text-white font-serif">
            Запись на консультацию юриста
          </h3>
          <p className="text-xs text-slate-400">
            Бесплатный первичный экспресс-разбор вашей правовой ситуации
          </p>
        </div>

        {submittedId ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-800 rounded-2xl space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white font-serif">Заявка принята!</h4>
            <p className="text-xs text-emerald-200">
              ID заявки: <span className="font-mono text-amber-400 font-bold">{submittedId}</span>
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Константин Алексеевич свяжется с вами по указанному номеру телефона в ближайшее время.
            </p>
            
            <div className="pt-2 border-t border-emerald-900/60 space-y-2">
              <p className="text-[11px] text-slate-400">Срочный вопрос? Свяжитесь напрямую:</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={LAWYER_INFO.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <span>Написать в WhatsApp</span>
                </a>
                <a
                  href={`tel:${LAWYER_INFO.phone}`}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{LAWYER_INFO.phone}</span>
                </a>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="mt-2 w-full py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:brightness-110 rounded-xl cursor-pointer"
            >
              Закрыть окно
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Ваше имя или название ИП/ООО *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Михаил / ИП Смирнов"
                required
                className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Контактный телефон *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 920 000 0000"
                required
                className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Электронная почта (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@example.com"
                className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Тема обращения
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Арбитраж, договор, задолженность..."
                className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Описание вопроса:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Кратко опишите ситуацию..."
                rows={3}
                className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 disabled:opacity-50 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Отправка...' : 'Отправить заявку юристу'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
