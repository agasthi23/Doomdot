import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Code2, 
  Server, 
  Layers, 
  Cpu, 
  Workflow, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Terminal,
  Zap,
  Clock,
  Shield,
  ExternalLink
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
  tagline: string;
  overview: string;
  deliverables: string[];
  architectureDetails: string[];
  techStack: string[];
  slaTimeline: string;
  pricingEstimate: string;
  codeContract: string;
  icon: React.ReactNode;
}

const BLUEPRINTS: ServiceBlueprint[] = [
  {
    id: 'frontend',
    number: '01',
    category: 'CLIENT-SIDE CRAFT & SPATIAL WEB',
    title: 'Front-End Development & UI/UX',
    tagline: 'Pixel-perfect, hyper-responsive interfaces locked at 60 FPS.',
    overview:
      'We engineer production frontends using Next.js 15, React 19, and Tailwind CSS. We eliminate bloated component libraries in favor of bespoke, lightweight UI elements, tactile micro-interactions, and GPU-accelerated 3D WebGL (Three.js) experiences designed to convert users and maintain 95+ Google Lighthouse scores.',
    deliverables: [
      'Next.js 15 App Router & React 19 Server Components architecture',
      'Tactile micro-interactions & smooth Framer Motion spring physics',
      'High-performance 3D WebGL (Three.js) & custom GLSL shaders',
      'Pixel-perfect mobile responsiveness with zero layout shift (CLS < 0.02)',
      'WCAG 2.1 AA accessibility compliance & keyboard navigation',
      'Complete Figma design token translation into Tailwind theme configs',
    ],
    architectureDetails: [
      'Zero unnecessary re-renders with fine-grained reactive state hooks',
      'Automated next-gen image optimization (WebP/AVIF with blur placeholders)',
      'Dynamic viewport LOD (Level of Detail) scaling for mobile 3D performance',
      'End-to-end component testing with Playwright & Vitest',
    ],
    techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion', 'Vite'],
    slaTimeline: '3 - 10 Business Days',
    pricingEstimate: '$1,500 - $4,500 depending on screen count & 3D scope',
    codeContract: `// Strict Frontend Component Contract
interface Viewport3DProps {
  particleDensity: number;
  bloomThreshold: number;
  onFPSDegrade?: (fps: number) => void;
}

export const ViewportCanvas: React.FC<Viewport3DProps> = ({
  particleDensity = 1200,
  bloomThreshold = 0.85
}) => {
  // 60 FPS GLSL Pipeline with Mobile Fallback
  return <ThreeVolumetricSwarm density={particleDensity} />;
};`,
    icon: <Code2 className="w-6 h-6 text-[#B8E351]" />,
  },
  {
    id: 'backend',
    number: '02',
    category: 'DISTRIBUTED ARCHITECTURE & APIS',
    title: 'Back-End Engineering & Scalable APIs',
    tagline: 'High-concurrency microservices with sub-40ms response benchmarks.',
    overview:
      'We architect backend services engineered in Go, Node.js, and Python FastAPI. Our focus is on normalized PostgreSQL database schemas, atomic Redis caching layers, and resilient REST & WebSocket APIs capable of sustaining millions of operations with zero downtime.',
    deliverables: [
      'Sub-40ms RESTful and real-time WebSocket API endpoints',
      'Normalized PostgreSQL schema design, indexing & connection pooling',
      'Atomic Redis caching layers, pub/sub queues & sliding-window rate limiters',
      'OAuth 2.0 / JWT stateless authentication & Role-Based Access Control (RBAC)',
      'Automated OpenAPI / Swagger contract documentation',
      'Database migration strategies with zero downtime rollback scripts',
    ],
    architectureDetails: [
      'B-Tree and GIN indexes tuned with EXPLAIN ANALYZE forensic profiling',
      'Connection pooling via PgBouncer with keep-alive optimization',
      'Idempotent API handlers preventing double-charges and race conditions',
      'Distributed tracing and structured logging via OpenTelemetry',
    ],
    techStack: ['Go', 'Node.js', 'Python FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'PgBouncer'],
    slaTimeline: '1 - 2 Weeks',
    pricingEstimate: '$2,500 - $6,000 depending on entity complexity & queues',
    codeContract: `// High-Concurrency Go Microservice Endpoint
func HandleOrderbookMatch(w http.ResponseWriter, r *http.Request) {
    ctx, cancel := context.WithTimeout(r.Context(), 35*time.Millisecond)
    defer cancel()

    order, err := decodeOrder(r.Body)
    if err != nil {
        http.Error(w, "invalid payload", http.StatusBadRequest)
        return
    }

    match, err := engine.ProcessOrderAtomic(ctx, order)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(match)
}`,
    icon: <Server className="w-6 h-6 text-[#B8E351]" />,
  },
  {
    id: 'fullstack',
    number: '03',
    category: 'TURNKEY END-TO-END PLATFORMS',
    title: 'Full-Stack Web Applications (Turnkey MVPs)',
    tagline: 'From day 0 database model to live production cloud URL.',
    overview:
      'The complete software lifecycle in one unified package. We take raw concept briefs and transform them into live production web applications: database architecture, backend APIs, client-side UI, Stripe billing integration, automated GitHub Actions CI/CD pipelines, and private repository handover.',
    deliverables: [
      'Complete turnkey web app from specification to live cloud URL',
      'Stripe & crypto checkout workflows with automated webhooks',
      'Secure multi-tenant authentication (OAuth, Magic Links, MFA)',
      'Automated GitHub Actions CI/CD deployment pipelines',
      'Docker containerized deployment on AWS, Vercel, or Fly.io',
      '30-Day post-launch warranty with zero-cost bug fixes',
    ],
    architectureDetails: [
      'Production staging environment provided on Day 3 of the sprint',
      'End-to-end typed contracts sharing TypeScript schemas between frontend & backend',
      'Database backup automations and point-in-time recovery setups',
      'Full private GitHub organization transfer with zero vendor lock-in',
    ],
    techStack: ['Next.js 15', 'Go / Node', 'PostgreSQL', 'Stripe', 'Docker', 'AWS / Vercel'],
    slaTimeline: '2 - 4 Weeks',
    pricingEstimate: '$3,500 - $9,500 (Escrow milestone release)',
    codeContract: `// Full-Stack Turnkey Deployment Schema
export const AppConfig = {
  db: new PostgreSQLPool({ maxConnections: 20 }),
  cache: new RedisCluster({ ttlSeconds: 3600 }),
  billing: new StripeIntegration({ webhookSecret: process.env.STRIPE_SECRET }),
  auth: new SessionManager({ mode: "jwt-cookie-strict" }),
  deploy: "aws-ecs-fargate"
};`,
    icon: <Layers className="w-6 h-6 text-[#B8E351]" />,
  },
  {
    id: 'ai-integrations',
    number: '04',
    category: 'INTELLIGENCE & AUTONOMOUS AGENTS',
    title: 'AI & Intelligent System Integrations',
    tagline: 'Autonomous LLM agents, vector search, and automated workflows.',
    overview:
      'We bring practical, high-ROI AI into your existing codebase. From multi-step Gemini tool-calling agents to semantic document search with Qdrant vector databases, we build reliable intelligent pipelines with prompt caching, latency budgets, and strict safety guards.',
    deliverables: [
      'Custom LLM agent pipelines with multi-step tool calling',
      'Retrieval-Augmented Generation (RAG) using Qdrant / Pinecone vector DBs',
      'Natural language database querying & automated report generation',
      'Cost-optimized token caching & model latency management',
      'Automated fallback handling and rate-limited API protection',
    ],
    architectureDetails: [
      'Semantic chunking strategies preventing hallucination on long documents',
      'Hybrid search combining BM25 keyword matching with dense embeddings',
      'Sandboxed execution environments for autonomous tool calling',
      'Sub-second streaming responses directly to the client browser',
    ],
    techStack: ['Gemini API', 'Python', 'Qdrant', 'FastAPI', 'LangChain', 'PyTorch'],
    slaTimeline: '1 - 3 Weeks',
    pricingEstimate: '$2,000 - $6,500 depending on agent tooling depth',
    codeContract: `// Autonomous Agent Tool Calling Contract
const agent = new AutonomousWorkflow({
  model: 'gemini-2.5-flash',
  tools: [
    sqlQueryTool,
    crmSyncTool,
    pdfParserTool
  ],
  safetyGuardrails: true,
  maxIterations: 5
});
const result = await agent.execute(userIntent);`,
    icon: <Cpu className="w-6 h-6 text-[#B8E351]" />,
  },
  {
    id: 'api-integrations',
    number: '05',
    category: 'SYSTEM INTEGRATIONS & ECOSYSTEMS',
    title: 'Third-Party & API Integrations',
    tagline: 'Connecting your platform to external services safely and reliably.',
    overview:
      'Connect your web application to external third-party ecosystems with zero headache. We implement rock-solid OAuth 2.0 authorization, payment gateways, Google Workspace connections, and resilient webhook receivers equipped with replay protection and dead-letter retry queues.',
    deliverables: [
      'Third-party OAuth 2.0 authorization & automated token refresh flows',
      'Idempotent webhook receivers with replay protection & dead-letter queues',
      'Payment provider integration (Stripe, LemonSqueezy, PayPal, Crypto)',
      'Google Workspace, Slack, Discord, and CRM API automations',
      'Real-time data synchronization between multi-tenant databases',
    ],
    architectureDetails: [
      'Cryptographic HMAC signature verification on all incoming webhooks',
      'Dead-letter queues in Redis ensuring zero dropped payment transactions',
      'Exponential backoff retry mechanisms for external API rate limits',
      'Full sandbox test suite mocking external provider responses',
    ],
    techStack: ['Webhooks', 'REST / GraphQL', 'OAuth 2.0', 'Stripe API', 'WebSockets', 'Supabase'],
    slaTimeline: '3 - 7 Business Days',
    pricingEstimate: '$1,200 - $3,500 depending on provider APIs',
    codeContract: `// Idempotent Webhook Receiver with Replay Protection
app.post('/api/webhooks/external', async (req, res) => {
  const verified = verifyHMACSignature(req.headers['x-signature'], req.rawBody);
  if (!verified) return res.status(401).send('Invalid signature');
  
  if (await redis.hasProcessed(req.body.eventId)) {
    return res.status(200).json({ status: 'already_processed' });
  }
  await queue.dispatchJob(req.body);
  res.status(200).json({ status: 'queued' });
});`,
    icon: <Workflow className="w-6 h-6 text-[#B8E351]" />,
  },
  {
    id: 'audits',
    number: '06',
    category: 'PERFORMANCE, SECURITY & REFACTORING',
    title: 'Codebase Audits & Performance Tuning',
    tagline: 'Modernizing legacy code, fixing bottlenecks, and cutting cloud bills.',
    overview:
      'Inherited a messy codebase or suffering from slow database queries? Our 4-person engineering team conducts exhaustive forensic audits. We profile bottlenecks, patch vulnerabilities, remove unnecessary bundle bloat, and deliver a clear refactoring roadmap.',
    deliverables: [
      'Comprehensive architecture, database & security audit report',
      'PostgreSQL query optimization & sub-50ms API benchmarking',
      'Front-end bundle reduction & asset delivery tuning',
      'Zero-downtime refactoring roadmap for brittle legacy systems',
      'TypeScript strict mode migration & automated unit test suites',
    ],
    architectureDetails: [
      'Profiling memory leaks and uncollected garbage in Node/Python processes',
      'Database connection leak diagnostics and pool optimization',
      'Lighthouse 95+ core web vitals optimization (LCP, FID, CLS)',
      'Security posture review checking CORS, CSP, and dependency vulnerabilities',
    ],
    techStack: ['TypeScript', 'PostgreSQL EXPLAIN', 'Lighthouse', 'Docker', 'Profiling Tools'],
    slaTimeline: '3 - 5 Business Days',
    pricingEstimate: '$1,200 - $3,000 for comprehensive report + patch PR',
    codeContract: `// Forensic Query Benchmark: Before vs After
-- Before: Sequential Scan on 1.2M rows (Latency: 480ms)
-- After: Partial B-Tree Composite Index (Latency: 4ms)
CREATE INDEX CONCURRENTLY idx_orders_customer_paid 
ON orders (customer_id, created_at DESC) 
WHERE status = 'PAID';`,
    icon: <ShieldCheck className="w-6 h-6 text-[#B8E351]" />,
  },
];

export const ExtendedServicesPage: React.FC<ExtendedServicesPageProps> = ({
  initialServiceId = 'frontend',
  onBackToHome,
  onSelectServiceAndContact,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const activeBlueprint =
    BLUEPRINTS.find((b) => b.id === selectedServiceId) || BLUEPRINTS[0];

  const handleHireClick = (serviceTitle: string) => {
    sound.playConfirm();
    onSelectServiceAndContact(serviceTitle);
  };

  return (
    <div className="min-h-screen bg-[#050607] text-white selection:bg-[#B8E351] selection:text-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-[#23430C] pb-6 mb-8">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onBackToHome();
            }}
            className="px-4 py-2 rounded-lg bg-[#0e1709] border border-[#23430C] hover:border-[#B8E351] text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#B8E351] group-hover:-translate-x-1 transition-transform" />
            <span>Back to Studio Overview</span>
          </button>

          <div className="flex items-center gap-3">
            <DoomLogo variant="lockup" size="sm" />
            <span className="hidden sm:inline text-xs font-mono text-zinc-500">
              /// DETAILED SERVICES SPECIFICATION
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mb-10 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#B8E351]">
            <Sparkles className="w-4 h-4 text-[#B8E351]" />
            <span>EXTENDED BLUEPRINT CATALOG</span>
            <span aria-hidden="true" className="text-[#23430C]">///</span>
            <span>01 TO 06 FULL BREAKDOWN</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Comprehensive Services Blueprint
          </h1>
          <p className="text-sm text-zinc-300 max-w-2xl font-sans leading-relaxed">
            Examine our exact architectural standards, technical deliverables, and code contracts. Everything is executed directly by our 4 co-founders with zero agency middle management.
          </p>
        </div>

        {/* Service Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-10">
          {BLUEPRINTS.map((bp) => {
            const isActive = bp.id === selectedServiceId;
            return (
              <button
                key={bp.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedServiceId(bp.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#12210a] border-[#B8E351] shadow-[0_0_15px_rgba(184,227,81,0.3)] ring-1 ring-[#B8E351]'
                    : 'bg-[#070b04] border-[#23430C] hover:border-[#B8E351]/50 hover:bg-[#0b1307]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#B8E351]' : 'text-zinc-500'}`}>
                    {bp.number}
                  </span>
                  <div className="text-zinc-400">
                    {bp.icon}
                  </div>
                </div>
                <div className="text-xs font-display font-bold text-white line-clamp-2">
                  {bp.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Blueprint Deep Dive Card */}
        <div className="rounded-3xl border-2 border-[#B8E351] bg-[#070b04]/95 p-6 sm:p-10 shadow-[0_0_40px_rgba(184,227,81,0.18)] text-left space-y-8">
          
          {/* Top Banner: Number, Title, SLA, Estimate */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#23430C]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#101c09] border border-[#23430C] text-[#B8E351] text-xs font-mono font-bold">
                  STEP {activeBlueprint.number}
                </span>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  {activeBlueprint.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                {activeBlueprint.title}
              </h2>

              <p className="text-sm font-mono text-[#B8E351]">
                {activeBlueprint.tagline}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-[#030602] border border-[#23430C] font-mono text-xs text-zinc-300">
                <span className="text-zinc-500 block text-[10px] uppercase">Turnaround SLA:</span>
                <strong className="text-white font-bold">{activeBlueprint.slaTimeline}</strong>
              </div>

              <button
                type="button"
                onClick={() => handleHireClick(activeBlueprint.title)}
                className="px-6 py-3 rounded-xl bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(184,227,81,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Book This Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Overview Paragraph */}
          <div>
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
              Engineering Overview:
            </h3>
            <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
              {activeBlueprint.overview}
            </p>
          </div>

          {/* Two-Column Details: Concrete Deliverables vs Architecture Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: What We Deliver */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8E351] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>OFFICIAL SPRINT DELIVERABLES</span>
              </div>

              <div className="space-y-3">
                {activeBlueprint.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#040802] border border-[#23430C] text-xs text-zinc-200">
                    <span className="w-5 h-5 rounded-full bg-[#12210a] text-[#B8E351] font-mono text-[10px] flex items-center justify-center shrink-0 border border-[#23430C]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-sans">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Architectural Standards & Code Contract */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8E351] font-bold">
                <Terminal className="w-4 h-4" />
                <span>ARCHITECTURAL CODE CONTRACT</span>
              </div>

              <div className="rounded-xl border border-[#23430C] bg-[#020401] p-4 font-mono text-xs shadow-inner overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#23430C] pb-2 mb-3 text-[10px] text-zinc-500">
                  <span className="text-[#B8E351] font-bold">CONTRACT://SPEC_{activeBlueprint.number}.TS</span>
                  <span>STRICT_TYPESCRIPT</span>
                </div>
                <pre className="text-emerald-400 overflow-x-auto leading-relaxed whitespace-pre font-mono text-[11px]">
                  <code>{activeBlueprint.codeContract}</code>
                </pre>
              </div>

              {/* Architecture Deep Points */}
              <div className="space-y-2 pt-2">
                <div className="text-[10px] font-mono uppercase text-zinc-400">
                  Architecture &amp; Quality Guarantees:
                </div>
                {activeBlueprint.architectureDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-[#B8E351] font-mono">»</span>
                    <span className="font-sans">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Tech Stack Pills */}
          <div className="pt-6 border-t border-[#23430C] flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 mr-2">TECH ARSENAL:</span>
            {activeBlueprint.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg bg-[#040802] border border-[#23430C] text-xs font-mono text-[#B8E351]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Bottom Action Footer inside Blueprint */}
          <div className="pt-6 border-t border-[#23430C] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Shield className="w-4 h-4 text-[#B8E351]" />
              <span>Full private GitHub repository ownership · Upwork / Fiverr escrow verified</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onBackToHome();
                }}
                className="px-4 py-2.5 rounded-lg border border-[#23430C] hover:border-[#B8E351] text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Return to Studio
              </button>

              <button
                type="button"
                onClick={() => handleHireClick(activeBlueprint.title)}
                className="px-6 py-2.5 rounded-lg bg-[#B8E351] hover:bg-[#d0f671] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(184,227,81,0.5)] flex items-center gap-2 cursor-pointer"
              >
                <span>Request {activeBlueprint.number}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
