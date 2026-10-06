import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Shield, Clock, Mail, ExternalLink, Copy, Check, Github, Zap } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { RobotAnchor } from './RobotCompanion.tsx';

interface ContactSectionProps {
  selectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ selectedService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceNeeded: selectedService || 'Full-Stack Web App',
    platform: 'Upwork',
    budget: '$3,000 - $6,000',
    timeline: 'Within 2-3 weeks',
    description: '',
  });

  React.useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({ ...prev, serviceNeeded: selectedService }));
    }
  }, [selectedService]);

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      sound.playError();
      setErrorMsg('Please complete all required fields (Name, Email, and Project Description).');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      sound.playError();
      setErrorMsg('Please provide a valid business email address.');
      return;
    }

    sound.playConfirm();
    setErrorMsg('');
    const generatedTicket = 'DD-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedTicket);
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    sound.playConfirm();
    navigator.clipboard.writeText('squad@doomdot.dev').then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    });
  };

  return (
    <section id="contact" className="py-24 bg-[#050607] border-t border-[#23430C] relative dot-matrix">
      <RobotAnchor x="62%" y="4%" scale={0.4} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <span className="text-[#B8E351] font-bold">04</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span>GET IN TOUCH</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span className="text-[#B8E351]">DIRECT DEVELOPER DISPATCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Ready to Build Your Project?
            </h2>
          </div>
          <p className="text-sm text-zinc-300 max-w-lg font-sans leading-relaxed">
            Have a project in mind? Reach out directly to our 4-person engineering squad. No salespeople or middlemen — you get an actionable technical response within 4 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-[#090e06] border border-[#23430C] rounded-2xl p-6 sm:p-8 lime-glow">
            {submitted ? (
              <div className="py-10 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#1b2f0a] border border-[#B8E351] text-[#B8E351] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(184,227,81,0.5)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-display text-white">
                  Inquiry Dispatched Successfully!
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto font-sans leading-relaxed">
                  Your project brief has been logged with reference ID <strong className="font-mono text-[#B8E351]">{ticketId}</strong>. Alex, Elena, Devon, and Kaelen will review your specifications and reply via email within 4 hours.
                </p>

                <div className="pt-6 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        serviceNeeded: 'Full-Stack Web App',
                        platform: 'Upwork',
                        budget: '$3,000 - $6,000',
                        timeline: 'Within 2-3 weeks',
                        description: '',
                      });
                    }}
                    className="px-5 py-2.5 text-xs font-mono text-zinc-300 hover:text-white bg-[#050804] border border-[#23430C] rounded-md transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left text-xs font-mono">
                {errorMsg && (
                  <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 rounded text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#030602] border border-[#23430C] rounded-md px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#B8E351] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@startup.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#030602] border border-[#23430C] rounded-md px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#B8E351] transition-colors"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                    Primary Service Needed
                  </label>
                  <select
                    value={formData.serviceNeeded}
                    onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                    className="w-full bg-[#030602] border border-[#23430C] rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-[#B8E351] transition-colors"
                  >
                    <option value="Front-End Development">Front-End Development &amp; UI/UX (Next.js / React / Three.js)</option>
                    <option value="Back-End Engineering">Back-End Engineering &amp; Scalable APIs (Go / Node / PostgreSQL)</option>
                    <option value="Full-Stack Web App">Full-Stack Web Application (Turnkey MVP)</option>
                    <option value="AI & Intelligent Systems">AI &amp; Intelligent System Integration (Gemini / Vector RAG)</option>
                    <option value="Third-Party Integrations">Third-Party &amp; API Integrations (Stripe / Webhooks / OAuth)</option>
                    <option value="Codebase Audit & Tuning">Codebase Audit &amp; Performance Tuning</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                      Contract Platform
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full bg-[#030602] border border-[#23430C] rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-[#B8E351] transition-colors"
                    >
                      <option value="Upwork">Upwork Escrow (Direct Hire)</option>
                      <option value="Fiverr">Fiverr Pro</option>
                      <option value="Direct Contract">Direct Milestone Escrow</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                      Target Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-[#030602] border border-[#23430C] rounded-md px-3.5 py-2.5 text-white focus:outline-none focus:border-[#B8E351] transition-colors"
                    >
                      <option value="$1,500 - $3,000">$1,500 - $3,000 (Small sprint / audit)</option>
                      <option value="$3,000 - $6,000">$3,000 - $6,000 (Standard MVP / API build)</option>
                      <option value="$6,000 - $12,000">$6,000 - $12,000 (Full-stack platform)</option>
                      <option value="$12,000+">$12,000+ (Enterprise / Complex AI system)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1.5 uppercase font-semibold">
                    Project Description &amp; Scope *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you want to build, existing tech stack, target timeline, or links to designs/repositories..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#030602] border border-[#23430C] rounded-md p-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#B8E351] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-[0_0_20px_rgba(184,227,81,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Project Brief Directly to the 4 Engineers</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Info & Guarantees */}
          <div className="lg:col-span-5 space-y-6 text-left font-mono">
            {/* Direct Email Card */}
            <div className="bg-[#090e06] border border-[#23430C] rounded-2xl p-6">
              <span className="text-[10px] text-[#B8E351] tracking-wider uppercase block mb-1">
                DIRECT INBOX
              </span>
              <h3 className="text-xl font-bold font-display text-white mb-2">
                Prefer direct email?
              </h3>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-4">
                You can write straight to our shared engineering inbox. All 4 founders receive and review incoming briefs simultaneously.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex-1 py-2.5 px-3 bg-[#030602] border border-[#23430C] hover:border-[#B8E351] rounded-md text-zinc-200 text-xs flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <span>squad@doomdot.dev</span>
                  {copiedEmail ? (
                    <span className="text-[#B8E351] flex items-center gap-1 text-[11px]">
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#B8E351]" />
                  )}
                </button>
              </div>
            </div>

            {/* Our Commitments */}
            <div className="bg-[#090e06] border border-[#23430C] rounded-2xl p-6 space-y-4">
              <span className="text-[10px] text-[#B8E351] tracking-wider uppercase block">
                OUR ENGINEERING COMMITMENTS
              </span>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#B8E351] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">Sub-4 Hour Response Time</div>
                    <div className="text-zinc-400 font-sans text-[11px] pt-0.5">
                      Fast turnaround on technical questions, spec reviews, and feasibility estimates.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-[#B8E351] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">Escrow Protection</div>
                    <div className="text-zinc-400 font-sans text-[11px] pt-0.5">
                      Hire us via Upwork or Fiverr escrow. Funds are released only upon milestone verification.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#B8E351] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">30-Day Post-Launch Warranty</div>
                    <div className="text-zinc-400 font-sans text-[11px] pt-0.5">
                      Every project includes 30 days of zero-cost bug fixes and deployment support.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Badge */}
            <div className="p-4 rounded-xl bg-[#101b0a] border border-[#B8E351]/50 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B8E351] animate-ping" />
                <span className="text-white font-bold font-display">CURRENT SQUAD CAPACITY</span>
              </div>
              <span className="text-[#B8E351] font-mono font-bold">1 SPRINT SLOT OPEN</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
