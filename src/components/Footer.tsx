import React, { useState } from 'react';
import { ArrowUp, Github, Linkedin, Terminal, Mail, Check, Copy, ExternalLink, Disc as Discord } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { DoomLogo } from './DoomLogo.tsx';
import { RobotAnchor } from './RobotCompanion.tsx';

interface FooterProps {
  onOpenTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTerminal }) => {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = () => {
    sound.playConfirm();
    navigator.clipboard.writeText('squad@doomdot.dev').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <footer className="relative bg-[#030405] border-t border-[#23430C] py-14 text-xs font-mono text-zinc-400">
      <RobotAnchor x="90%" y="10%" scale={0.35} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#23430C]/80">
          {/* Brand mark */}
          <div className="space-y-1 text-left">
            <DoomLogo variant="lockup" size="md" />
            <div className="text-zinc-500 text-[11px] pt-1">
              Digital Engineering Studio · 2 SE + 2 CS Architects
            </div>
          </div>

          {/* Direct Platform Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="text-zinc-300 hover:text-[#B8E351] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#B8E351]" />
              <span>{copied ? 'Copied squad@doomdot.dev' : 'squad@doomdot.dev'}</span>
            </button>
            <span aria-hidden="true" className="text-[#23430C]">///</span>
            <a
              href="https://upwork.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#B8E351] transition-colors"
            >
              Upwork Profile
            </a>
            <span aria-hidden="true" className="text-[#23430C]">///</span>
            <a
              href="https://fiverr.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#B8E351] transition-colors"
            >
              Fiverr Pro
            </a>
            <span aria-hidden="true" className="text-[#23430C]">///</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#B8E351] transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 bg-[#080d05] border border-[#23430C] hover:border-[#B8E351] rounded text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#B8E351]" />
          </button>
        </div>

        {/* Navigation Mirror */}
        <div className="py-6 border-b border-[#23430C]/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
            <a href="#about" onClick={() => sound.playHover()} className="hover:text-[#B8E351] transition-colors">
              Who We Are
            </a>
            <a href="#services" onClick={() => sound.playHover()} className="hover:text-[#B8E351] transition-colors">
              Services
            </a>
            <a href="#team" onClick={() => sound.playHover()} className="hover:text-[#B8E351] transition-colors">
              The Team
            </a>
            <a href="#contact" onClick={() => sound.playHover()} className="hover:text-[#B8E351] transition-colors">
              Contact Us
            </a>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onOpenTerminal();
              }}
              className="hover:text-[#B8E351] transition-colors inline-flex items-center gap-1 text-[#B8E351]"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>CLI [~]</span>
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 font-mono">
            4 ENGINEERS · DIRECT DISPATCH · ZERO AGENCY BLOAT
          </div>
        </div>

        {/* Bottom copyright & status */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-zinc-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} DoomDot. 2 SE + 2 CS Engineering Guild. All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-pulse" />
              <span>Obsidian &amp; Cyber Lime Theme</span>
            </span>
            <span aria-hidden="true" className="text-[#23430C]">///</span>
            <span>Upwork Top-Rated &amp; Fiverr Pro Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
