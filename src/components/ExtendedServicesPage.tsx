import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Code2,
  Server,
  Layers,
  Smartphone,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
} from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { DoomLogo } from './DoomLogo.tsx';

interface ExtendedServicesPageProps {
  initialServiceId?: string;
  onBackToHome: () => void;
  onSelectServiceAndContact: (serviceName: string) => void;
}

interface ServiceBlueprint {
  id: string;
  number: string;
  category: string;
  title: string;
  summary: string;
  overview: string;
  deliverables: string[];
  architectureDetails: string[];
  techStack: string[];
  slaTimeline: string;
  icon: React.ReactNode;
}

const BLUEPRINTS: ServiceBlueprint[] = [
  {
    id: 'front-end',
    number: '01',
    category: 'CLIENT-SIDE CRAFT & SPATIAL WEB',
    title: 'Front-End Development & UI/UX',
    summary:
      'We engineer immersive, pixel-perfect, and high-performance user interfaces optimized for speed, accessibility, and fluid user experiences across all devices.',
    overview:
      'We produce high-performance frontends using Next.js 15, React 19, and Tailwind CSS. We eliminate bloated component libraries in favor of bespoke, lightweight UI elements, tactile micro-interactions, and GPU-accelerated experiences designed to convert users and maintain high performance scores.',
    deliverables: [
      'Next.js App Router & React Server Components architecture',
      'Tactile micro-interactions & smooth Framer Motion spring physics',
      'High-performance responsive rendering & custom styles',
      'Pixel-perfect mobile responsiveness with zero layout shift',
      'WCAG accessibility compliance & keyboard navigation',
      'Complete Figma design token translation into Tailwind theme configs',
    ],
    architectureDetails: [
      'Zero unnecessary re-renders with fine-grained reactive state hooks',
      'Automated next-gen image optimization with blur placeholders',
      'Dynamic viewport scaling for optimal mobile performance',
      'End-to-end component testing setup',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    slaTimeline: '3 - 10 Business Days',
    icon: <Code2 className="w-5 h-5" />,
  },
  {
    id: 'back-end',
    number: '02',
    category: 'SERVER-SIDE ARCHITECTURE & DATA PIPELINES',
    title: 'Back-End Engineering & Scalable APIs',
    summary:
      'We build robust, secure server-side architectures and high-concurrency APIs designed to handle complex business logic reliably.',
    overview:
      'We architect dependable database models, secure authentication layers, and lightning-fast server endpoints. Built to scale effortlessly, our backends handle intensive transaction loads with absolute data integrity and fault-tolerant reliability.',
    deliverables: [
      'RESTful & GraphQL API endpoint architecture',
      'Secure JWT / OAuth 2.0 authentication and role-based access control',
      'Optimized relational database schema design & indexing',
      'Automated request validation, sanitization, and rate-limiting',
      'Containerized environment setups for seamless deployment',
      'Comprehensive API documentation and Postman collections',
    ],
    architectureDetails: [
      'Zero-trust database query optimization and connection pooling',
      'Encrypted environment credential management and secret rotation',
      'Automated database migration pipelines',
      'Robust error-handling middleware with structured logging',
    ],
    techStack: ['Node.js', 'Python', 'PostgreSQL', 'Express', 'Docker', 'Redis'],
    slaTimeline: '5 - 12 Business Days',
    icon: <Server className="w-5 h-5" />,
  },
  {
    id: 'full-stack',
    number: '03',
    category: 'END-TO-END PRODUCT ENGINEERING (TURNKEY MVPS)',
    title: 'Full-Stack Web Applications',
    summary:
      'Turnkey end-to-end software development from database modeling to live cloud deployment, complete with secure authentication and third-party integrations.',
    overview:
      'Turnkey end-to-end software development from zero-day database modeling to live cloud production URLs, including Stripe billing, hardened auth, and private GitHub repository handovers.',
    deliverables: [
      'Full-stack integration connecting client frontends to robust server backends',
      'Complete database setup with automated migrations and backup configuration',
      'Production cloud deployment with live custom domains and SSL',
      'Integrated payment gateways and billing webhook management',
      'Secure user account management, password hashing, and session handling',
      'Clean, modular codebase handoff with private GitHub repository access',
    ],
    architectureDetails: [
      'Strict separation of concerns between client and server layers',
      'End-to-end type safety across the entire application stack',
      'Automated CI/CD pipeline configuration for fast deployments',
      'Production-ready environment configurations',
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker', 'Git'],
    slaTimeline: '7 - 14 Business Days',
    icon: <Layers className="w-5 h-5" />,
  },
  {
    id: 'mobile-web',
    number: '04',
    category: 'CROSS-PLATFORM & NATIVE MOBILE SOLUTIONS',
    title: 'Mobile & Web Applications',
    summary:
      'From cross-platform mobile applications to responsive web apps, we craft touch-optimized digital experiences with zero layout shifts.',
    overview:
      'We engineer fluid applications that bridge the gap between web browsers and mobile devices. Utilizing unified, high-performance codebases, we deliver native-feeling gesture controls, smooth frame rates, and offline-ready capabilities.',
    deliverables: [
      'Cross-platform mobile app development for iOS and Android',
      'Responsive adaptive layouts optimized for varying screen dimensions',
      'Native device feature integrations (camera, push notifications, local storage)',
      'Smooth gesture navigation and fluid transition animations',
      'App store readiness packaging and asset generation',
      'Unified web and mobile shared component architecture',
    ],
    architectureDetails: [
      'Optimized bundle sizing for fast mobile startup speeds',
      'Cross-device testing coverage across major OS versions',
      'Efficient state management for offline data syncing',
      'Clean native bridge configurations',
    ],
    techStack: ['React Native', 'Next.js', 'TypeScript', 'Expo', 'Tailwind CSS'],
    slaTimeline: '7 - 15 Business Days',
    icon: <Smartphone className="w-5 h-5" />,
  },
  {
    id: 'ai-integrations',
    number: '05',
    category: 'MACHINE LEARNING & LLM AUTOMATION',
    title: 'AI & Intelligent System Integrations',
    summary:
      'We design and integrate intelligent systems—incorporating modern machine learning pipelines, LLMs, and automated workflow tools.',
    overview:
      'We build and integrate next-generation intelligent capabilities into your software ecosystem. From custom data processing pipelines and vector search configurations to advanced LLM-powered workflows, we make your product smart.',
    deliverables: [
      'Custom AI model and LLM API integrations (OpenAI, Anthropic, local models)',
      'Vector database setup and semantic search implementation (Pinecone, Chroma)',
      'Automated data preprocessing and ingestion pipelines',
      'Prompt engineering frameworks and agentic workflow structures',
      'High-performance FastAPI microservices for AI task handling',
      'Secure API key management and token usage monitoring',
    ],
    architectureDetails: [
      'Optimized context window management to minimize latency and costs',
      'Robust fallback handling for API rate limits and downtime',
      'Secure handling of proprietary user data and privacy compliance',
      'Asynchronous background processing for long-running AI tasks',
    ],
    techStack: ['Python', 'PyTorch', 'OpenAI API', 'LangChain', 'FastAPI', 'Vector DBs'],
    slaTimeline: '5 - 12 Business Days',
    icon: <Cpu className="w-5 h-5" />,
  },
];

export const ExtendedServicesPage: React.FC<ExtendedServicesPageProps> = ({
  initialServiceId = 'front-end',
  onBackToHome,
  onSelectServiceAndContact,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Keep the selected tab in sync if the page is opened with a different service
  useEffect(() => {
    setSelectedServiceId(initialServiceId);
  }, [initialServiceId]);

  const activeBlueprint =
    BLUEPRINTS.find((b) => b.id === selectedServiceId) || BLUEPRINTS[0];

  const handleHireClick = (serviceTitle: string) => {
    sound.playConfirm();
    onSelectServiceAndContact(serviceTitle);
  };

  return (
    <div className="min-h-screen bg-[#050607] text-white selection:bg-[#BBE351] selection:text-[#050607] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ================= TOP HEADER BAR ================= */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-12">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onBackToHome();
            }}
            className="px-4 py-2 rounded-lg border border-white/15 hover:border-[#BBE351] text-xs font-mono text-white/80 hover:text-white transition-colors flex items-center gap-2 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE351]"
          >
            <ArrowLeft className="w-4 h-4 text-[#BBE351] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Studio Overview</span>
          </button>

          <div className="flex items-center gap-3">
            <DoomLogo variant="lockup" size="sm" />
            <span className="hidden sm:inline text-xs font-mono text-white/50">
              /// DETAILED SERVICES SPECIFICATION
            </span>
          </div>
        </div>

        {/* ================= HERO TITLE ================= */}
        <div className="mb-12 text-left space-y-5">
          {/* Status badge with live dot */}
          <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#23430C] bg-[#23430C]/30 text-xs font-mono text-[#BBE351]">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#BBE351] opacity-75 animate-ping motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#BBE351]" />
            </span>
            <span>SERVICE DETAILS</span>
            <span aria-hidden="true" className="text-white/30">
              |
            </span>
            <span>5 SERVICES AVAILABLE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-[1.1]">
            What You Get With <span className="text-[#BBE351]">Every Service</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-2xl font-sans leading-relaxed">
            Choose a service below to see exactly what we deliver, how long it takes, and the
            quality standards we build to. Every project is handled directly by our 4
            co-founders, with no agency middle management.
          </p>
        </div>

        {/* ================= SERVICE SELECTOR TABS ================= */}
        <div
          role="tablist"
          aria-label="Services"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10"
        >
          {BLUEPRINTS.map((bp) => {
            const isActive = bp.id === selectedServiceId;
            return (
              <button
                key={bp.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  sound.playClick();
                  setSelectedServiceId(bp.id);
                }}
                className={`relative p-4 rounded-xl border text-left transition-colors duration-200 cursor-pointer flex flex-col justify-between gap-4 min-h-[112px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE351] ${
                  isActive
                    ? 'bg-[#23430C]/40 border-[#BBE351]'
                    : 'bg-white/[0.02] border-white/10 hover:border-[#BBE351]/50 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isActive ? 'text-[#BBE351]' : 'text-white/50'
                    }`}
                  >
                    {bp.number}
                  </span>
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-[#BBE351] text-[#050607]' : 'bg-[#23430C]/60 text-[#BBE351]'
                    }`}
                  >
                    {bp.icon}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-display font-bold text-white leading-snug line-clamp-2">
                  {bp.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* ================= ACTIVE SERVICE CARD ================= */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden text-left">
          {/* Thin accent line on top */}
          <div aria-hidden="true" className="h-1 w-full bg-[#BBE351]" />

          <div className="p-6 sm:p-10 space-y-12">
            {/* Top banner: number, category, title, summary, SLA, button */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-10 border-b border-white/10">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#23430C] text-[#BBE351] text-xs font-mono font-bold">
                    SERVICE {activeBlueprint.number}
                  </span>
                  <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
                    {activeBlueprint.category}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                  {activeBlueprint.title}
                </h2>

                <p className="text-sm sm:text-base text-[#BBE351] font-sans leading-relaxed">
                  {activeBlueprint.summary}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-60">
                <div className="px-4 py-3 rounded-xl border border-white/10 bg-[#050607] font-mono text-xs flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#BBE351] shrink-0" />
                  <div>
                    <span className="text-white/50 block text-[10px] uppercase">
                      Turnaround SLA
                    </span>
                    <strong className="text-white font-bold">{activeBlueprint.slaTimeline}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleHireClick(activeBlueprint.title)}
                  className="px-6 py-3 rounded-xl bg-[#BBE351] hover:bg-[#BBE351]/90 text-[#050607] font-bold text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h3 className="text-xs font-mono text-[#BBE351] uppercase tracking-wider mb-3">
                Engineering Overview
              </h3>
              <p className="text-sm sm:text-base text-white/85 font-sans leading-relaxed max-w-4xl">
                {activeBlueprint.overview}
              </p>
            </div>

            {/* Deliverables */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#BBE351] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>OFFICIAL SPRINT DELIVERABLES</span>
              </div>

              <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeBlueprint.deliverables.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-3 p-5 rounded-xl border border-white/10 bg-[#050607] hover:border-[#BBE351]/50 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#23430C] text-[#BBE351] font-mono text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-white/90 font-sans leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Guarantees */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#BBE351] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>ARCHITECTURE &amp; QUALITY GUARANTEES</span>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeBlueprint.architectureDetails.map((detail, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-3 p-5 rounded-xl border border-[#23430C] bg-[#23430C]/20"
                  >
                    <ShieldCheck className="w-5 h-5 text-[#BBE351]" />
                    <span className="text-sm text-white/90 font-sans leading-relaxed">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Arsenal */}
            <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-white/60 mr-2">TECH ARSENAL:</span>
              {activeBlueprint.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg border border-[#23430C] bg-[#23430C]/40 text-xs font-mono text-[#BBE351]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                <Shield className="w-4 h-4 text-[#BBE351] shrink-0" />
                <span>
                  Full private GitHub repository ownership · Upwork / Fiverr escrow verified
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onBackToHome();
                  }}
                  className="px-4 py-2.5 rounded-lg border border-white/15 hover:border-[#BBE351] text-xs font-mono text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BBE351]"
                >
                  Return to Studio
                </button>

                <button
                  type="button"
                  onClick={() => handleHireClick(activeBlueprint.title)}
                  className="px-6 py-2.5 rounded-lg bg-[#BBE351] hover:bg-[#BBE351]/90 text-[#050607] font-bold text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Request This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};