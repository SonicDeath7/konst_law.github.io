import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutBio } from './components/AboutBio';
import { Services } from './components/Services';
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
          onScrollToContacts={() => {
            const el = document.getElementById('contacts');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <AboutBio />

        <Services
          onSelectServiceForConsultation={(serviceTitle) =>
            handleOpenConsultation(`Услуга: ${serviceTitle}`)
          }
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
