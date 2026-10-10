import React, { useState } from 'react';
import {
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  Check,
} from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { DoomLogo } from './DoomLogo.tsx';
import { RobotAnchor } from './RobotCompanion.tsx';

interface FooterProps {
  onOpenTerminal: () => void;
}

// Inline SVG brand icons
const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onOpenTerminal }) => {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    sound.playClick();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCopyEmail = () => {
    sound.playConfirm();

    navigator.clipboard
      .writeText('doomdotsquad@gmail.com')
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch((error) => {
        console.error('Failed to copy email:', error);
      });
  };

  const currentYear = new Date().getFullYear();

  const socials = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      href: 'https://instagram.com',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com',
    },
    {
      name: 'TikTok',
      icon: TikTokIcon,
      href: 'https://tiktok.com',
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      href: 'https://facebook.com',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com',
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[#23430C] bg-[#030405] pt-16 pb-8 font-mono text-xs text-zinc-400">
      {/* Top glowing border effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B8E351]/50 to-transparent" />

      <RobotAnchor x="92%" y="5%" scale={0.3} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 border-b border-[#23430C]/50 pb-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-4">
            <DoomLogo variant="lockup" size="md" />

            <p className="max-w-xs text-[11px] leading-relaxed text-zinc-500">
              Digital Engineering Studio. We build fast,reliable,
              production-ready software.
            </p>

            {/*
            <div className="pt-1 text-[11px] text-zinc-500">
              Digital Engineering Studio · 2 SE + 2 CS Architects
            </div>
            */}
          </div>

          {/* Navigation Column */}
          <div className="space-y-4 md:col-span-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#B8E351]">
              Navigation
            </h4>

            <ul className="space-y-2.5">
              <li>
                <a
                  href="#about"
                  onClick={() => sound.playHover()}
                  className="inline-block rounded px-1 -mx-1 transition-all hover:bg-[#B8E351]/5 hover:text-[#B8E351]"
                >
                  Who We Are
                </a>
              </li>

              <li>
                <a
                  href="#services"
                  onClick={() => sound.playHover()}
                  className="inline-block rounded px-1 -mx-1 transition-all hover:bg-[#B8E351]/5 hover:text-[#B8E351]"
                >
                  Services
                </a>
              </li>

              <li>
                <a
                  href="#team"
                  onClick={() => sound.playHover()}
                  className="inline-block rounded px-1 -mx-1 transition-all hover:bg-[#B8E351]/5 hover:text-[#B8E351]"
                >
                  The Team
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  onClick={() => sound.playHover()}
                  className="inline-block rounded px-1 -mx-1 transition-all hover:bg-[#B8E351]/5 hover:text-[#B8E351]"
                >
                  Contact Us
                </a>
              </li>

              {/*
              <li>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenTerminal();
                  }}
                  className="inline-flex items-center gap-1 text-[#B8E351] transition-colors hover:text-white"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>CLI [~]</span>
                </button>
              </li>
              */}
            </ul>
          </div>

          {/* Socials Column */}
          <div className="space-y-4 md:col-span-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#B8E351]">
              Socials
            </h4>

            <ul className="space-y-3">
              {socials.map(({ name, icon: Icon, href }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    onClick={() => sound.playHover()}
                    className="group flex items-center gap-2.5 transition-colors"
                  >
                    <Icon className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-[#B8E351]" />

                    <span className="text-[11px] text-zinc-500 transition-colors group-hover:text-[#B8E351]">
                      {name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="flex flex-col space-y-4 md:col-span-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-[#B8E351]">
              Connect
            </h4>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="group flex w-full cursor-pointer items-center gap-2 text-left text-zinc-300 transition-colors hover:text-[#B8E351]"
              >
                <span className="rounded border border-[#23430C] bg-[#0A0F08] p-1.5 transition-colors group-hover:border-[#B8E351]/50">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-[#B8E351]" />
                  ) : (
                    <Mail className="h-3.5 w-3.5 text-[#B8E351]" />
                  )}
                </span>

                <span className="text-[11px]">
                  {copied
                    ? 'Copied to clipboard!'
                    : 'doomdotsquad@gmail.com'}
                </span>
              </button>
            </div>

            {/* Back to Top — Green Touch */}
            <div className="mt-auto flex justify-start pt-8 md:justify-end">
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll back to top"
                className="
                  group inline-flex items-center gap-3
                  rounded-full
                  border border-[#B8E351]/30
                  bg-[#B8E351]/5
                  px-4 py-2.5
                  text-[#B8E351]
                  transition-all duration-300 ease-out
                  hover:border-[#B8E351]/80
                  hover:bg-[#B8E351]/15
                  hover:shadow-[0_0_22px_rgba(184,227,81,0.35)]
                  active:scale-95
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#B8E351]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#030405]
                "
              >
                <span className="text-xs font-medium tracking-wide transition-colors duration-300">
                  Top
                </span>

                <ArrowUp
                  className="
                    h-4 w-4
                    transition-transform duration-300 ease-out
                    group-hover:-translate-y-0.5
                  "
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[10px] tracking-wide text-zinc-500 sm:flex-row">
          <div>
            &copy; {currentYear} DoomDot. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            {/*
            <span aria-hidden="true" className="text-[#23430C]">
              ///
            </span>
            <span>Upwork Top-Rated &amp; Fiverr Pro Verified</span>
            */}

            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B8E351] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B8E351]" />
              </span>

              <span>Obsidian &amp; Cyber Lime Theme</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};