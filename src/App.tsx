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

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'services-extended'>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('frontend');
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('Full-Stack Web App');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [stage, setStage] = useState<Stage>(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'free' : 'hidden',
  );

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
  const handleCrack = useCallback(() => setStage('intro'), []);
  const handleRobotLanded = useCallback(() => setStage('free'), []);
  const handleIntroDone = useCallback(() => setStage('free'), []);

  const handleOpenExtendedServices = (serviceId: string = 'frontend') => {
    setSelectedServiceId(serviceId);
    setCurrentView('services-extended');
    window.location.hash = 'services-extended';
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.location.hash = 'services';
    setTimeout(() => {
      const servicesElem = document.getElementById('services');
      if (servicesElem) {
        servicesElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSelectServiceAndContact = (serviceTitle: string) => {
    setSelectedServiceForContact(serviceTitle);
    setCurrentView('home');
    window.location.hash = 'contact';
    setTimeout(() => {
      const contactElem = document.getElementById('contact');
      if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
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
    }, 100);
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
      <DotIntro
        onCrack={handleCrack}
        onDone={handleIntroDone}
        revealTarget="#site-root"
      />
      <RobotCompanion stage={stage} onLanded={handleRobotLanded} />

      <div
        id="site-root"
        className="min-h-screen bg-[#050607] text-[#ffffff] selection:bg-[#B8E351] selection:text-black relative"
      >
        {/* 4 Clean Tabs Top Navbar */}
        <Navbar onOpenTerminal={handleOpenTerminal} />

        {/* Main Content Sections: Streamlined 4-Section Architecture */}
        <main>
          {/* 1. Introduction // Who We Are (Hero with 3D Swarm & Floating Neon Computer) */}
          <HeroNeon onOpenTerminal={handleOpenTerminal} />

          {/* 2. What We Do // Short & Sweet In-Place Stepper Services */}
          <ServicesSection
            onOpenExtendedServices={handleOpenExtendedServices}
            onSelectServiceAndContact={handleSelectServiceAndContact}
          />

          {/* 3. About Us // Meet The 4-Person Engineering Team */}
          <SquadSection />

          {/* 4. Contact Us // Direct Developer Dispatch & Escrow Hire */}
          <ContactSection selectedService={selectedServiceForContact} />
        </main>

        {/* Clean Footer */}
        <Footer onOpenTerminal={handleOpenTerminal} />

        {/* Developer Terminal CLI */}
        <TerminalCLI
          isOpen={terminalOpen}
          onClose={handleCloseTerminal}
          onNavigateToContact={handleNavigateToContact}
        />
      </div>
    </div>
  );
}
