import React, { useState } from 'react';
import { ExternalLink, Code2, Layers, Cpu, X, Check, Activity } from 'lucide-react';
import { CAPSTONE_PROJECTS } from '../data/doomdotData.ts';
import { ProjectCaseStudy } from '../types.ts';
import { sound } from '../utils/audio.ts';

export const CaseStudiesSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'saas' | 'ai-backend' | 'mobile' | 'creative-3d' | 'mvp'>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectCaseStudy | null>(null);

  const filteredProjects = filter === 'all' 
    ? CAPSTONE_PROJECTS 
    : CAPSTONE_PROJECTS.filter(p => p.category === filter);

  return (
    <section id="work" className="py-24 bg-[#050607] border-t border-[#23430C] relative dot-matrix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <span className="text-[#B8E351] font-bold">04</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span>THE WAR CHEST</span>
              <span aria-hidden="true" className="text-[#23430C]">///</span>
              <span className="text-[#B8E351]">CAP-STONES &amp; PRODUCTION ARCHITECTURES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Featured Case Studies &amp; Builds
            </h2>
          </div>
          <p className="text-sm text-zinc-300 max-w-md font-sans">
            Real systems engineered for high throughput, sub-50ms latency, and zero downtime. Click any operation to inspect technical architectures and code metrics.
          </p>
        </div>

        {/* Filter Bar (Segmented Controls) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#090e06] rounded-lg border border-[#23430C] mb-10 max-w-2xl overflow-x-auto">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'saas', label: 'Full-Stack SaaS' },
            { id: 'ai-backend', label: 'AI & Data Pipelines' },
            { id: 'mobile', label: 'Mobile Apps' },
            { id: 'creative-3d', label: 'Creative 3D Web' },
            { id: 'mvp', label: 'MVP Sprints' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sound.playClick();
                setFilter(tab.id as typeof filter);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#1b2f0a] text-[#B8E351] border border-[#23430C] font-bold shadow-[0_0_10px_rgba(184,227,81,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#090e06] border border-[#23430C] hover:border-[#B8E351] rounded-xl p-6 flex flex-col justify-between transition-all group hover:bg-[#0d1508] hover:shadow-[0_0_20px_rgba(184,227,81,0.25)] text-left"
            >
              <div>
                {/* Header metadata */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
                  <span className="text-zinc-300">{project.clientType}</span>
                  <span className="text-[#B8E351] font-bold uppercase">{project.category.replace('-', ' ')}</span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold font-display text-white group-hover:text-[#B8E351] transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-sans">
                  {project.tagline}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-[#050804] border border-[#23430C] rounded font-mono text-xs mb-6">
                  {project.metrics.map((metric, i) => (
                    <div key={i} className="text-left">
                      <div className="text-[10px] text-zinc-400 truncate">{metric.label}</div>
                      <div className="text-[#B8E351] font-bold tabular-nums mt-0.5">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 mb-5 text-[11px] font-mono">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-[#0e160a] text-zinc-300 border border-[#23430C] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 4 && (
                    <span className="px-1.5 py-0.5 text-zinc-500 font-mono">+{project.stack.length - 4}</span>
                  )}
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveModalProject(project);
                  }}
                  className="w-full py-2.5 px-4 text-xs font-mono font-bold text-zinc-200 hover:text-black bg-[#101b0a] hover:bg-[#B8E351] border border-[#23430C] hover:border-[#B8E351] rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#B8E351] group-hover:text-black" />
                  <span>Inspect Architecture &amp; Demo</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Deep Architecture & Sandbox Preview */}
        {activeModalProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
            onClick={() => setActiveModalProject(null)}
          >
            <div
              className="bg-[#090e06] border border-[#B8E351] rounded-xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl lime-glow-lg my-8 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveModalProject(null);
                }}
                className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white bg-[#050804] border border-[#23430C] rounded cursor-pointer"
                aria-label="Close case study details"
              >
                <X className="w-4 h-4 text-[#B8E351]" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8E351] mb-2">
                <Activity className="w-3.5 h-3.5 text-[#B8E351]" />
                <span>CASE DOSSIER // {activeModalProject.title.toUpperCase()}</span>
                <span aria-hidden="true" className="text-[#23430C]">///</span>
                <span className="text-zinc-400">{activeModalProject.clientType}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-2">
                {activeModalProject.title}
              </h2>
              <p className="text-sm text-zinc-300 mb-6 font-sans">
                {activeModalProject.tagline}
              </p>

              {/* Quantified Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-[#050804] border border-[#23430C] rounded mb-6 font-mono">
                {activeModalProject.metrics.map((m, idx) => (
                  <div key={idx}>
                    <span className="text-xs text-zinc-400 block">{m.label}</span>
                    <span className="text-lg font-bold text-[#B8E351] tabular-nums">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Challenge vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-xs leading-relaxed font-sans">
                <div className="bg-[#050804] p-4 rounded border border-[#23430C]">
                  <div className="font-mono text-zinc-300 uppercase font-bold mb-2 flex items-center gap-1.5">
                    <span className="text-red-400">The Technical Challenge</span>
                  </div>
                  <p className="text-zinc-300">
                    {activeModalProject.challenge}
                  </p>
                </div>

                <div className="bg-[#050804] p-4 rounded border border-[#23430C]">
                  <div className="font-mono text-[#B8E351] uppercase font-bold mb-2 flex items-center gap-1.5">
                    <span>DoomDot Solution Architecture</span>
                  </div>
                  <p className="text-zinc-300">
                    {activeModalProject.solution}
                  </p>
                </div>
              </div>

              {/* Simulated Benchmark Log */}
              <div className="p-4 bg-black rounded border border-[#23430C] font-mono text-xs mb-6">
                <div className="flex items-center justify-between text-zinc-400 pb-2 mb-2 border-b border-[#23430C]">
                  <span className="text-[#B8E351] flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#B8E351] animate-ping" />
                    LIVE PRODUCTION BENCHMARK LOG
                  </span>
                  <span className="text-white">COVERAGE: 99.4%</span>
                </div>
                <div className="text-zinc-300 space-y-1">
                  <div><span className="text-[#B8E351]">GET</span> /api/v1/telemetry/stream [200 OK] — <span className="text-white">34ms latency</span></div>
                  <div><span className="text-emerald-400">REDIS</span> state_mutex_acquire [PASSED] — <span className="text-white">0 lock contention</span></div>
                  <div><span className="text-zinc-400">THREAD_POOL</span> 8/8 workers pinned — resident memory: <span className="text-white">38.4 MB</span></div>
                </div>
              </div>

              {/* Stack & Squad Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#23430C] text-xs font-mono">
                <div>
                  <span className="text-zinc-400 block mb-1">Squad Lead On This Build:</span>
                  <span className="text-[#B8E351] font-bold">{activeModalProject.squadMembers.join(' + ')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="#contact"
                    onClick={() => {
                      sound.playConfirm();
                      setActiveModalProject(null);
                    }}
                    className="px-5 py-2.5 bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold rounded tracking-wide transition-all shadow-[0_0_12px_rgba(184,227,81,0.5)] cursor-pointer"
                  >
                    Request Similar Build
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
