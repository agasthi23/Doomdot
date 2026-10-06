import React from 'react';
import { RobotAnchor } from './RobotCompanion.tsx';
import { 
  Users, 
  Code2, 
  Server, 
  Cpu, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Github, 
  Linkedin, 
  Mail,
  ArrowRight,
  Zap,
  GitBranch,
  Clock
} from 'lucide-react';
import { sound } from '../utils/audio.ts';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  degree: string;
  avatarInitial: string;
  tagline: string;
  specialties: string[];
  github: string;
  linkedin: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'agasthi',
    name: 'Agasthi Silva',
    role: 'Co-Founder & Software Engineer',
    degree: 'B.Sc. Software Engineering',
    avatarInitial: 'AS',
    tagline: 'Modern Web Architectures & Client Systems',
    specialties: ['TypeScript', 'Next.js 15', 'React 19', 'PostgreSQL', 'Tailwind'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'gavin',
    name: 'Gavin Ranasinghe',
    role: 'Co-Founder & Software Engineer',
    degree: 'B.Sc. Software Engineering',
    avatarInitial: 'GR',
    tagline: 'Distributed Systems & Scalable Cloud APIs',
    specialties: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'thamidu',
    name: 'Thamidu Samarasinghe',
    role: 'Co-Founder & Computer Science',
    degree: 'B.Sc. Computer Science',
    avatarInitial: 'TS',
    tagline: 'Intelligent Workflows & Machine Algorithms',
    specialties: ['Computer Science', 'Python', 'FastAPI', 'Gemini API', 'Qdrant'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'odhisha',
    name: 'Odhisha Rathnayaka',
    role: 'Co-Founder & Computer Science',
    degree: 'B.Sc. Computer Science',
    avatarInitial: 'OR',
    tagline: 'Platform Security & Interactive 3D WebGL',
    specialties: ['Computer Science', 'OAuth 2.0', 'Three.js', 'Webhooks', 'React'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
];

const WHY_CHOOSE_US = [
  {
    icon: <Zap className="w-5 h-5 text-[#B8E351]" />,
    title: 'Direct Engineer Access (Zero Middlemen)',
    description:
      'You collaborate directly with the 4 co-founders who write every line of code. No sales reps, account managers, or outsourced junior developers. Daily updates via Discord or Slack.',
    stat: '100% DIRECT DEV ACCESS',
  },
  {
    icon: <Clock className="w-5 h-5 text-[#B8E351]" />,
    title: 'High-Velocity Sprints with 30-Day Warranty',
    description:
      'We ship production code in focused weekly milestones. Every completed project includes 30 days of complimentary bug fixes, performance monitoring, and live SLA support.',
    stat: '30-DAY WARRANTY INCLUDED',
  },
  {
    icon: <GitBranch className="w-5 h-5 text-[#B8E351]" />,
    title: '100% Code & Intellectual Property Ownership',
    description:
      'Private GitHub repository handover from day one. Clean, type-safe, fully documented code with complete commercial copyright and zero vendor lock-in.',
    stat: 'FULL IP HANDOVER',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#B8E351]" />,
    title: 'Software Engineering + Computer Science Rigor',
    description:
      'Our team combines modern software architecture with computer science algorithm design and security hardening. Systems engineered for sub-30ms latencies and zero vulnerabilities.',
    stat: 'SE + CS DEGREES COMBINED',
  },
];

export const SquadSection: React.FC = () => {
  return (
    <section id="team" className="py-20 bg-[#050607] border-t border-[#23430C] relative cyber-grid">
      {/* Anchor alias for squad links */}
      <span id="squad" className="absolute -top-20" aria-hidden="true" />
      <RobotAnchor x="94%" y="4%" scale={0.35} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================================================================= */}
        {/* 1. SECTION HEADER: OUR TEAM                                       */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left border-b border-[#23430C] pb-6">
          <div>
            <div className="flex items-center gap-2 text-h6 font-mono text-zinc-400 mb-2">
              <span className="text-[#B8E351] font-bold">03</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span>CORE SQUAD</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span className="text-[#B8E351]">OUR TEAM</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Our Team
            </h2>
            <p className="text-sm text-zinc-300 max-w-2xl font-sans pt-2">
              Four dedicated founding software engineers and computer scientists working directly on your codebase. Zero account managers, zero outsourced freelancers, and 100% technical transparency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-lg bg-[#0e1709] border border-[#23430C] text-xs font-mono text-[#B8E351] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-ping" />
              <span>4 / 4 CO-FOUNDERS ACTIVE</span>
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. THE 4 TEAM MEMBER CARDS                                        */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-16">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-[#23430C] hover:border-[#B8E351] bg-[#070b04]/90 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(184,227,81,0.2)] group"
            >
              <div>
                {/* Top Badge & Initials Avatar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#12210a] to-[#040802] border-2 border-[#23430C] group-hover:border-[#B8E351] flex items-center justify-center font-display font-black text-xl text-[#B8E351] shadow-inner transition-colors">
                    {member.avatarInitial}
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#0a1406] text-[#B8E351] border border-[#23430C]">
                    Co-Founder
                  </span>
                </div>

                {/* Name & Title */}
                <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover:text-[#B8E351] transition-colors mb-1">
                  {member.name}
                </h3>
                
                <p className="text-xs font-mono text-[#B8E351] font-semibold mb-1.5">
                  {member.role}
                </p>

                <div className="mb-3">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-[#030602] border border-[#23430C]">
                    🎓 {member.degree}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-5">
                  {member.tagline}
                </p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {member.specialties.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-[#030602] border border-[#23430C] text-[11px] font-mono text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Social Links */}
              <div className="pt-4 border-t border-[#23430C] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-[10px] text-zinc-500">100% CODE OWNERSHIP</span>

                <div className="flex items-center gap-2">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#040802] border border-[#23430C] hover:border-[#B8E351] hover:text-[#B8E351] transition-colors"
                    title={`${member.name} GitHub`}
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#040802] border border-[#23430C] hover:border-[#B8E351] hover:text-[#B8E351] transition-colors"
                    title={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================= */}
        {/* 3. WHY YOU NEED TO CHOOSE US                                      */}
        {/* ================================================================= */}
        <div className="relative mb-14 text-left">
          <RobotAnchor x="96%" y="6%" scale={0.3} />
          <div className="border-b border-[#23430C] pb-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                <span className="text-[#B8E351] font-bold">CORE ADVANTAGE</span>
                <span aria-hidden="true" className="text-[#23430C]">///</span>
                <span>ZERO MIDDLEMEN · GUARANTEED QUALITY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                Why You Need To Choose Us
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md font-sans">
              Traditional agencies bill for layers of middle management. We replace overhead with direct, battle-tested engineering output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#23430C] bg-[#070b04]/90 p-6 flex flex-col justify-between hover:border-[#B8E351]/80 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(184,227,81,0.15)]"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#0e1c09] border border-[#23430C] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>

                  <h4 className="text-base font-bold font-display text-white mb-2 group-hover:text-[#B8E351] transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#23430C]/60 text-[10px] font-mono font-bold text-[#B8E351]">
                  {item.stat}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. COLLECTIVE STATEMENT & CTA BANNER                              */}
        {/* ================================================================= */}
        <div className="rounded-2xl border border-[#23430C] bg-[#070b04]/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#B8E351]">
              <Sparkles className="w-4 h-4 text-[#B8E351]" />
              <span className="font-bold">READY TO BUILD WITH US?</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold font-display text-white">
              Work Directly With Agasthi, Gavin, Thamidu & Odhisha
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans">
              Send us your project scope or architectural requirements. We reply with a detailed technical feasibility review and fixed quote within 24 hours.
            </p>
          </div>

          <a
            href="#contact"
            onClick={() => sound.playConfirm()}
            className="px-6 py-3 rounded-xl bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(184,227,81,0.5)] shrink-0 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Message The Team</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
