import React, { useState } from 'react';
import { Calculator, Check, Copy, ArrowRight, Sparkles, Terminal, Zap } from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface FeatureOption {
  id: string;
  name: string;
  category: string;
  points: number;
}

const FEATURE_OPTIONS: FeatureOption[] = [
  { id: 'auth', name: 'Auth & RBAC (User Roles)', category: 'Core', points: 1 },
  { id: 'payments', name: 'Stripe Payments / Subscriptions', category: 'Core', points: 2 },
  { id: 'realtime', name: 'Real-time WebSockets / Live Sync', category: 'Backend', points: 2 },
  { id: 'ai', name: 'AI / LLM Tool Calling & RAG Pipeline', category: 'AI', points: 3 },
  { id: 'admin', name: 'Custom Admin & Metrics Dashboard', category: 'Frontend', points: 2 },
  { id: 'shaders', name: 'Custom Three.js 3D / Shaders', category: 'Creative', points: 3 },
  { id: 'mobile', name: 'iOS & Android Native Shells', category: 'Mobile', points: 3 },
  { id: 'database', name: 'High-Throughput DB & Cache Layer', category: 'Backend', points: 2 },
];

export const SprintEstimator: React.FC = () => {
  const [projectType, setProjectType] = useState<'mvp' | 'saas' | 'mobile' | 'ai' | 'audit'>('mvp');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['auth', 'payments']);
  const [platform, setPlatform] = useState<'upwork' | 'fiverr' | 'direct'>('upwork');
  const [copied, setCopied] = useState(false);

  const toggleFeature = (id: string) => {
    sound.playClick();
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  // Calculate scope points
  const basePoints = projectType === 'mvp' ? 4 : projectType === 'saas' ? 6 : projectType === 'mobile' ? 7 : projectType === 'ai' ? 5 : 3;
  const featurePoints = selectedFeatures.reduce((acc, featId) => {
    const feat = FEATURE_OPTIONS.find(f => f.id === featId);
    return acc + (feat ? feat.points : 0);
  }, 0);

  const totalPoints = basePoints + featurePoints;
  const estimatedDays = Math.max(10, Math.round(totalPoints * 1.4));
  const estimatedSprints = Math.ceil(estimatedDays / 10);
  const recommendedSquad = totalPoints > 10 ? 'Full 4-Engineer Syndicate' : '2-Engineer Strike Pod';

  // Generate copyable RFP brief
  const rfpText = `[DOOMDOT PROJECT SCOPE BRIEF]
Archetype: ${projectType.toUpperCase()}
Platform Preference: ${platform.toUpperCase()}
Features Required:
${selectedFeatures.map(f => {
  const item = FEATURE_OPTIONS.find(opt => opt.id === f);
  return ` - ${item ? item.name : f}`;
}).join('\n')}

Scope Complexity Score: ${totalPoints} pts
Estimated Delivery: ~${estimatedDays} Business Days (${estimatedSprints} Sprint cycles)
Recommended Squad: ${recommendedSquad}
Stack: React, Next.js, Node/Python, PostgreSQL`;

  const handleCopy = () => {
    sound.playConfirm();
    navigator.clipboard.writeText(rfpText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section id="estimator" className="py-24 bg-[#050607] border-t border-[#23430C] relative cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <span className="text-[#B8E351] font-bold">05</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span>INTERACTIVE SCOPE CALCULATOR</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span className="text-[#B8E351]">FOR UPWORK, FIVERR &amp; DIRECT CLIENTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Project Sprint &amp; Scope Estimator
            </h2>
          </div>
          <p className="text-sm text-zinc-300 max-w-md font-sans">
            Configure your technical requirements in under 60 seconds. Get an instant scope breakdown and copy a formatted project brief for Upwork or Fiverr escrow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8 bg-[#090e06] border border-[#23430C] p-6 sm:p-8 rounded-xl text-left">
            {/* Step 1: Project Archetype */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                1. Select Project Archetype
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'mvp', label: '14-Day MVP Sprint' },
                  { id: 'saas', label: 'Full-Stack SaaS Platform' },
                  { id: 'mobile', label: 'Cross-Platform Mobile' },
                  { id: 'ai', label: 'AI Agent & Pipeline' },
                  { id: 'audit', label: 'Architecture Overhaul' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setProjectType(type.id as typeof projectType);
                    }}
                    className={`p-3 text-xs font-mono rounded border text-left transition-all cursor-pointer ${
                      projectType === type.id
                        ? 'bg-[#1b2f0a] border-[#B8E351] text-white shadow-[0_0_12px_rgba(184,227,81,0.3)] font-bold'
                        : 'bg-[#050804] border-[#23430C] text-zinc-400 hover:text-white hover:border-[#3d6e15]'
                    }`}
                  >
                    <div>{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Feature Matrix Selection */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                2. Select Core Architectural Features
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FEATURE_OPTIONS.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3 text-xs rounded border text-left flex items-center justify-between transition-colors cursor-pointer font-mono ${
                        isChecked
                          ? 'bg-[#152309] border-[#B8E351] text-white'
                          : 'bg-[#050804] border-[#23430C] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span>{feat.name}</span>
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#B8E351] border-[#B8E351] text-black font-bold' : 'border-[#23430C]'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Platform Preference */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                3. Preferred Contracting Platform
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'upwork', label: 'Upwork Escrow' },
                  { id: 'fiverr', label: 'Fiverr Pro' },
                  { id: 'direct', label: 'Direct Contract' },
                ].map((plat) => (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setPlatform(plat.id as typeof platform);
                    }}
                    className={`py-2 px-3 text-xs font-mono text-center rounded border transition-colors cursor-pointer ${
                      platform === plat.id
                        ? 'bg-[#1b2f0a] text-[#B8E351] border-[#B8E351] font-bold shadow-[0_0_10px_rgba(184,227,81,0.3)]'
                        : 'bg-[#050804] border-[#23430C] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {plat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5 bg-[#090e06] border border-[#23430C] rounded-xl p-6 sm:p-8 space-y-6 shadow-xl lime-glow text-left">
            <div className="flex items-center justify-between border-b border-[#23430C] pb-3">
              <span className="text-xs font-mono text-[#B8E351] flex items-center gap-1.5 font-bold">
                <Calculator className="w-4 h-4 text-[#B8E351]" />
                <span>MISSION ESTIMATE</span>
              </span>
              <span className="text-xs font-mono text-white flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-pulse" />
                READY TO DISPATCH
              </span>
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-2 gap-4 py-2 font-mono">
              <div className="bg-[#050804] p-4 rounded border border-[#23430C]">
                <span className="text-xs text-zinc-400 block mb-1">Target Timeline</span>
                <span className="text-2xl font-bold text-white tabular-nums">~{estimatedDays} Days</span>
                <span className="text-[10px] text-[#B8E351] block mt-0.5">{estimatedSprints} sprint cycles</span>
              </div>
              <div className="bg-[#050804] p-4 rounded border border-[#23430C]">
                <span className="text-xs text-zinc-400 block mb-1">Recommended Party</span>
                <span className="text-lg font-bold text-[#B8E351]">{recommendedSquad}</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">2 SE + 2 CS synergy</span>
              </div>
            </div>

            {/* Generated Brief Preview */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span>Copyable Project Brief / RFQ:</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="hover:text-white flex items-center gap-1 text-[#B8E351] transition-colors cursor-pointer font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#B8E351]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Brief'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black/95 rounded border border-[#23430C] text-[11px] font-mono text-zinc-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {rfpText}
              </pre>
            </div>

            {/* Direct Hire CTA */}
            <div className="pt-2">
              <a
                href="#contact"
                onClick={() => sound.playConfirm()}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-black bg-[#B8E351] hover:bg-[#d0f671] transition-all rounded shadow-[0_0_20px_rgba(184,227,81,0.6)] border border-[#c4eb63] flex items-center justify-center gap-2 group whitespace-nowrap cursor-pointer"
              >
                <span>Dispatch This Brief to DoomDot</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-[11px] text-zinc-400 text-center mt-2 font-mono">
                Milestone release protection guaranteed via {platform.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
