import React from 'react';

export const KineticTicker: React.FC = () => {
  const primaryTech = [
    'REACT',
    'NODE.JS',
    'PYTHON',
    'C++',
    'NEXT.JS 15',
    'POSTGRESQL',
    'TYPESCRIPT',
    'DOCKER & K8S',
    'THREE.JS & GLSL',
    'FASTAPI',
    'TAILWIND CSS',
    'REDIS',
  ];

  const valueProps = [
    'ZERO INTERNSHIPS · 100% PRODUCTION SYSTEMS',
    '14-DAY PRODUCTION MVP SPRINTS',
    '4 SOFTWARE ENGINEERING & CS CO-FOUNDERS',
    'SUB-50MS API RESPONSE LATENCY',
    'UPWORK ESCROW & FIVERR PRO VERIFIED',
    'DIRECT DISCORD / SLACK ACCESS WITH BUILDERS',
    'ZERO GHOSTING GUARANTEE',
  ];

  return (
    <div className="w-full py-4 border-y border-[#23430C] bg-[#050803] overflow-hidden select-none relative my-6">
      {/* Side gradient feathering scrims */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050607] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050607] to-transparent z-10" />

      {/* Primary Tech Stack Marquee (React, Node, Python, C++, Next.js, PostgreSQL) */}
      <div className="flex animate-marquee space-x-8 text-xs font-mono tracking-widest py-1">
        {[...primaryTech, ...primaryTech, ...primaryTech].map((tech, i) => (
          <div key={i} className="inline-flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351] shadow-[0_0_8px_#B8E351]" />
            <span className="text-white font-bold hover:text-[#B8E351] transition-colors">
              {tech}
            </span>
          </div>
        ))}
      </div>

      {/* Secondary Value Prop Reverse Marquee */}
      <div className="flex animate-marquee-reverse space-x-8 text-[11px] font-mono tracking-wide py-1 text-zinc-400">
        {[...valueProps, ...valueProps].map((item, i) => (
          <div key={i} className="inline-flex items-center gap-3 shrink-0">
            <span className="w-1 h-1 rounded-full bg-[#23430C]" />
            <span className="hover:text-[#B8E351] transition-colors">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
