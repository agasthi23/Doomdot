import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { DoomLogo } from './DoomLogo.tsx';

interface NavbarProps {
  onOpenTerminal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const navLinks = [
    { label: 'Who We Are', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'The Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-[#050607]/95 backdrop-blur-md border-[#23430C]/80 shadow-[0_4px_20px_rgba(5,6,7,0.8)]'
          : 'bg-transparent border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand mark with official DoomDot glowing emblem & wordmark */}
        <a
          href="#"
          onClick={() => sound.playClick()}
          className="group flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8E351] rounded py-1"
          aria-label="DoomDot Web Development Startup - Home"
          title="DoomDot"
        >
          <DoomLogo variant="lockup" size="sm" className="hover:scale-105 transition-transform" />
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => sound.playHover()}
              className="hover:text-[#B8E351] transition-colors relative py-1 hover:underline underline-offset-4 decoration-[#B8E351]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions - Audio Toggle + Location Pill + Hire CTA */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle (Arcade Haptic Bleeps) */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? 'Turn Sound FX On (Arcade Haptics)' : 'Mute Sound FX'}
            className="p-2 text-zinc-400 hover:text-white bg-[#0e140a] hover:bg-[#16240d] border border-[#23430C] rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-[#B8E351]"
            aria-label={isMuted ? 'Enable tactical sound effects' : 'Mute tactical sound effects'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#B8E351] animate-pulse" />
            )}
          </button>

          {/* Location Badge: Sri Lanka LK */}
          <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 bg-[#0e140a]/80 border border-[#23430C] rounded-full text-xs font-mono text-zinc-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-pulse" />
            <span>Sri Lanka</span>
            <span className="text-[10px] text-zinc-500 font-semibold tracking-wider">LK</span>
          </div>

          {/* Primary Action Button: Glowing Cyber Lime Button */}
          <a
            href="#contact"
            onClick={() => sound.playConfirm()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-[#B8E351] hover:bg-[#d0f671] active:scale-[0.98] transition-all rounded-md shadow-[0_0_16px_rgba(184,227,81,0.5)] hover:shadow-[0_0_24px_rgba(184,227,81,0.8)] border border-[#c4eb63] whitespace-nowrap"
          >
            <span>Hire Squad</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#B8E351]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b04] border-b border-[#23430C] px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-3 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className="text-zinc-300 hover:text-[#B8E351] py-1 border-b border-zinc-800/40"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-[#B8E351]" />
              <span>Based in Sri Lanka (LK)</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};