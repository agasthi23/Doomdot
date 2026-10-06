import React from 'react';
import { Check, X, ShieldAlert, Zap, Users, ShieldCheck } from 'lucide-react';
import { AGENCY_COMPARISON, FREELANCE_TRUST_POINTS } from '../data/doomdotData.ts';

export const AgencyComparison: React.FC = () => {
  return (
    <section id="why-doomdot" className="py-24 bg-[#050607] border-t border-[#23430C] relative dot-matrix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <span className="text-[#B8E351] font-bold">06</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span>THE DOOMDOT ADVANTAGE</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span className="text-[#B8E351]">WHY HIRE A 4-DEV SQUAD</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Why 4 Hungry Engineers Beat a 40-Person Agency
            </h2>
          </div>
          <p className="text-sm text-zinc-300 max-w-md font-sans">
            Traditional agencies charge you for executive overhead, layers of account managers, and junior outsourcing. We operate with zero bloat and direct technical ownership.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto mb-16 rounded-xl border border-[#23430C] bg-[#090e06]">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#23430C] bg-[#0c1409]">
                <th className="py-4 px-4 font-semibold text-zinc-400 uppercase tracking-wider w-1/4">
                  Operating Dimension
                </th>
                <th className="py-4 px-4 font-semibold text-zinc-400 uppercase tracking-wider w-1/4">
                  Traditional Agency
                </th>
                <th className="py-4 px-4 font-semibold text-zinc-400 uppercase tracking-wider w-1/4">
                  Solo Freelancer
                </th>
                <th className="py-4 px-4 font-bold text-[#B8E351] uppercase tracking-wider w-1/4 bg-[#14230b] border-l border-r border-[#23430C]">
                  DoomDot 4-Squad
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23430C]/60">
              {AGENCY_COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#0d1608] transition-colors">
                  <td className="py-4 px-4 font-semibold text-white">
                    {row.dimension}
                  </td>
                  <td className="py-4 px-4 text-zinc-400">
                    {row.traditionalAgency}
                  </td>
                  <td className="py-4 px-4 text-zinc-400">
                    {row.soloFreelancer}
                  </td>
                  <td className="py-4 px-4 text-white font-medium bg-[#14230b]/60 border-l border-r border-[#23430C]">
                    <span className="text-[#B8E351] font-semibold">✦ </span>
                    {row.doomdot}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Adjacent Freelance Trust & Guarantee Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FREELANCE_TRUST_POINTS.map((point, index) => (
            <div
              key={index}
              className="bg-[#090e06] border border-[#23430C] hover:border-[#B8E351] rounded-xl p-5 flex flex-col justify-between transition-all text-left"
            >
              <div>
                <div className="w-8 h-8 rounded bg-[#16270b] border border-[#23430C] flex items-center justify-center text-[#B8E351] mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold font-display text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
