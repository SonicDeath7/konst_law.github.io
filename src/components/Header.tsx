import React, { useState, useEffect } from 'react';
import { LAWYER_INFO } from '../data/legalData';
import { Phone, Mail, Menu, X, ArrowUpRight, Scale, Shield } from 'lucide-react';

interface HeaderProps {
  onOpenConsultationModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConsultationModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'О юристе', href: '#about' },
    { name: 'Услуги', href: '#services' },
    { name: 'Практика', href: '#cases' },
    { name: 'Этапы', href: '#process' },
    { name: 'Отзывы & FAQ', href: '#faq' },
    { name: 'Контакты', href: '#contacts' }
  ];

  return (
    <>
      {/* Top Utility Contact Bar */}
      <div className="bg-[#080d1a] border-b border-slate-800/80 text-xs text-slate-400 py-2 px-4 sm:px-8 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-amber-400 font-medium">
              <Shield className="w-3.5 h-3.5 mr-1 text-amber-400" />
              ИП Мирошин К.А.
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block text-slate-300">
              г. Тула
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${LAWYER_INFO.phone}`}
              className="flex items-center hover:text-amber-400 transition-colors font-medium text-slate-200"
            >
              <Phone className="w-3.5 h-3.5 mr-1 text-amber-400" />
              {LAWYER_INFO.phoneFormatted}
            </a>
            <a
              href={`mailto:${LAWYER_INFO.email}`}
              className="hidden sm:flex items-center hover:text-amber-400 transition-colors text-slate-300"
            >
              <Mail className="w-3.5 h-3.5 mr-1 text-amber-400" />
              {LAWYER_INFO.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Floating Nav Bar */}
      <header className="sticky top-3 z-50 px-4 sm:px-8 transition-all duration-300">
        <div
          className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
            isScrolled
              ? 'bg-[#0f172a]/95 backdrop-blur-xl border border-slate-700/70 shadow-2xl shadow-black/50 py-3 px-4 sm:px-6'
              : 'bg-[#111c33]/80 backdrop-blur-md border border-slate-800/90 py-4 px-4 sm:px-6'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-500/10 group-hover:shadow-amber-500/30 transition-all">
                <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
                  <Scale className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white font-serif leading-tight">
                  Мирошин К.А.
                </span>
                <span className="text-[10px] tracking-wider uppercase text-amber-400 font-semibold">
                  Официальный сайт
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-full transition-all"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={onOpenConsultationModal}
                className="px-4 py-2 text-xs font-semibold text-slate-950 btn-amber-glow rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-1 group cursor-pointer"
              >
                <span>Записаться</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center space-x-2">
              <button
                onClick={onOpenConsultationModal}
                className="px-3 py-1.5 text-xs font-semibold text-slate-950 btn-amber-glow rounded-lg font-medium"
              >
                Консультация
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
                aria-label="Открыть меню"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-7xl mx-auto bg-[#0f172a] border border-slate-700/80 rounded-2xl p-4 shadow-2xl animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:text-amber-400 rounded-xl transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
                <a
                  href={`tel:${LAWYER_INFO.phone}`}
                  className="w-full py-2.5 px-4 text-center text-xs font-semibold text-slate-100 bg-slate-800 rounded-xl flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Позвонить: {LAWYER_INFO.phoneFormatted}</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
