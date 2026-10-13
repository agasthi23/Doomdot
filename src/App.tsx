/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import HeroNeon from './components/HeroNeon.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { SquadSection } from './components/SquadSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { TerminalCLI } from './components/TerminalCLI.tsx';
import { ExtendedServicesPage } from './components/ExtendedServicesPage.tsx';
import DotIntro from './components/DotIntro.tsx';
import RobotCompanion from './components/RobotCompanion.tsx';
import type { Stage } from './components/RobotCompanion.tsx';
import { StatsSection } from './components/StatsSection.tsx';
import { TechStackShowcase } from './components/TechStackShowcase.tsx';
import WhyChooseUs from './components/WhyChooseUs.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'services-extended'>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('frontend');
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('Full-Stack Web App');
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Track if we are returning specifically from the extended services catalog
  const [skipIntro, setSkipIntro] = useState(false);

  const [stage, setStage] = useState<Stage>(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'free';
    }
    return 'hidden';
  });

  // Sync hash routing so #services-extended opens the page directly
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#services-extended') {
        setCurrentView('services-extended');
      } else if (currentView === 'services-extended') {
        setCurrentView('home');
      }
    };

    if (window.location.hash === '#services-extended') {
      setCurrentView('services-extended');
    }

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView]);

  const handleOpenTerminal = () => setTerminalOpen(true);
  const handleCloseTerminal = () => setTerminalOpen(false);
  const handleCrack = useCallback(() => setStage('intro'), [setStage]);
  const handleRobotLanded = useCallback(() => setStage('free'), [setStage]);
  const handleIntroDone = useCallback(() => setStage('free'), [setStage]);

  const handleOpenExtendedServices = (serviceId: string = 'frontend') => {
    setSelectedServiceId(serviceId);
    setCurrentView('services-extended');
    window.location.hash = 'services-extended';
  };

  const handleBackToHome = (targetHash?: string) => {
    setSkipIntro(true); // Tell App to skip intro when returning from catalog
    setCurrentView('home');
    
    window.history.replaceState(null, '', window.location.pathname + (targetHash || '#services'));

    setTimeout(() => {
      const targetId = targetHash ? targetHash.replace('#', '') : 'services';
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'instant' });
      }
    }, 30);
  };

  const handleSelectServiceAndContact = (serviceTitle: string) => {
    setSelectedServiceForContact(serviceTitle);
    setSkipIntro(true);
    setCurrentView('home');
    window.history.replaceState(null, '', window.location.pathname + '#contact');
    setTimeout(() => {
      const contactElem = document.getElementById('contact');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNavigateToContact = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const contactElem = document.getElementById('contact');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // If in Extended Services Blueprint view, render the dedicated extended page
  if (currentView === 'services-extended') {
    return (
      <div className="min-h-screen bg-[#050607] text-[#ffffff] selection:bg-[#B8E351] selection:text-black relative">
        <ExtendedServicesPage
          initialServiceId={selectedServiceId}
          onBackToHome={handleBackToHome}
          onSelectServiceAndContact={handleSelectServiceAndContact}
        />
        <Footer onOpenTerminal={handleOpenTerminal} />
        <TerminalCLI
          isOpen={terminalOpen}
          onClose={handleCloseTerminal}
          onNavigateToContact={handleNavigateToContact}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050607] text-[#ffffff] selection:bg-[#B8E351] selection:text-black relative">
      {!skipIntro && (
        <DotIntro
          onCrack={handleCrack}
          onDone={handleIntroDone}
          revealTarget="#site-root"
        />
      )}
      <RobotCompanion stage={skipIntro ? 'free' : stage} onLanded={handleRobotLanded} />

      <div
        id="site-root"
        className="min-h-screen bg-[#050607] text-[#ffffff] selection:bg-[#B8E351] selection:text-black relative"
      >
        {/* 4 Clean Tabs Top Navbar */}
        <Navbar onOpenTerminal={handleOpenTerminal} onNavigateHome={handleBackToHome} />

        {/* Main Content Sections */}
        <main>
          <HeroNeon onOpenTerminal={handleOpenTerminal} />

          <div className="pt-30">
            <StatsSection />
          </div>

          <ServicesSection
            onOpenExtendedServices={handleOpenExtendedServices}
            onSelectServiceAndContact={handleSelectServiceAndContact}
          />

          <SquadSection />

          <WhyChooseUs />

          <TechStackShowcase />

          <ContactSection selectedService={selectedServiceForContact} />
        </main>

        <Footer onOpenTerminal={handleOpenTerminal} />

        <TerminalCLI
          isOpen={terminalOpen}
          onClose={handleCloseTerminal}
          onNavigateToContact={handleNavigateToContact}
        />
      </div>
    </div>
  );
}