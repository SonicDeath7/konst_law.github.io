import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutBio } from './components/AboutBio';
import { Services } from './components/Services';
import { LegalCalculator } from './components/LegalCalculator';
import { ProcessSection } from './components/ProcessSection';
import { CasesSection } from './components/CasesSection';
import { ReviewsFAQ } from './components/ReviewsFAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';

export default function App() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [modalTopic, setModalTopic] = useState('Запись на консультацию');
  const [modalMessage, setModalMessage] = useState('');

  const handleOpenConsultation = (topic = 'Запись на консультацию', message = '') => {
    setModalTopic(topic);
    setModalMessage(message);
    setIsConsultationOpen(true);
  };

  const handleApplyCalculatorEstimate = (category: string, estimatePrice: string) => {
    const topicText = `Расчет по категории: ${category}`;
    const msgText = `Рассчитанная ориентировочная стоимость: ${estimatePrice}. Прошу связаться для уточнения пакета документов.`;
    handleOpenConsultation(topicText, msgText);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Header Navigation */}
      <Header
        onOpenConsultationModal={() => handleOpenConsultation()}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenConsultationModal={() => handleOpenConsultation()}
          onOpenCalculator={() => {
            const el = document.getElementById('calculator');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <AboutBio />

        <Services
          onSelectServiceForConsultation={(serviceTitle) =>
            handleOpenConsultation(`Услуга: ${serviceTitle}`)
          }
        />

        <LegalCalculator
          onApplyEstimate={handleApplyCalculatorEstimate}
        />

        <ProcessSection
          onOpenConsultationModal={() => handleOpenConsultation()}
        />

        <CasesSection />

        <ReviewsFAQ />

        <ContactSection
          initialTopic={modalTopic}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        defaultTopic={modalTopic}
        initialMessage={modalMessage}
      />

    </div>
  );
}
