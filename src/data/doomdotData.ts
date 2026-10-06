import { SquadMember, ProjectCaseStudy, ServiceQuest } from '../types.ts';

export const HERO_IMAGE = '/src/assets/images/doomdot_hero_cyber_1790607168159.jpg';

export interface SkillTreeCategory {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  level: string;
  unlockedSkills: {
    name: string;
    description: string;
    powerRating: number;
    stack: string[];
  }[];
  turnaround: string;
  idealFor: string;
}

export const SQUAD_ROSTER: SquadMember[] = [
  {
    id: 'agasthi',
    name: 'Agasthi Silva',
    callsign: 'AGASTHI',
    degree: 'Software Engineering',
    role: 'Co-Founder & Software Engineer',
    gender: 'female',
    avatar: '/src/assets/images/doomdot_squad_anya_1790607190660.jpg',
    bio: 'Software engineer engineering high-velocity modern web systems, client-side architecture, and full-stack digital products. Dedicated to zero-overhead execution and clean production code.',
    stats: {
      systemArchitecture: 96,
      algorithmicVelocity: 94,
      uiPrecision: 95,
      debuggingInstinct: 97,
      caffeineTolerance: 95,
    },
    primaryWeapons: ['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'Node.js'],
    secondaryWeapons: ['Redis', 'Docker', 'REST APIs', 'Git', 'Vite'],
    recentShipment: {
      title: 'Full-Stack Digital MVP Pipeline',
      description: 'Engineered responsive reactive client interface with sub-100ms API sync.',
      commitsThisMonth: 160,
    },
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      upworkProfile: 'https://upwork.com',
      fiverrProfile: 'https://fiverr.com',
    },
  },
  {
    id: 'gavin',
    name: 'Gavin Ranasinghe',
    callsign: 'GAVIN',
    degree: 'Software Engineering',
    role: 'Co-Founder & Software Engineer',
    gender: 'male',
    avatar: '/src/assets/images/doomdot_squad_tariq_1790607240901.jpg',
    bio: 'Software engineer specialized in scalable system design, distributed backend APIs, database optimization, and high-concurrency cloud workflows.',
    stats: {
      systemArchitecture: 95,
      algorithmicVelocity: 96,
      uiPrecision: 92,
      debuggingInstinct: 96,
      caffeineTolerance: 96,
    },
    primaryWeapons: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'TypeScript'],
    secondaryWeapons: ['FastAPI', 'WebSockets', 'GraphQL', 'AWS', 'Linux'],
    recentShipment: {
      title: 'High-Concurrency Cluster Router',
      description: 'Architected distributed cache synchronization layer handling thousands of req/sec.',
      commitsThisMonth: 154,
    },
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      upworkProfile: 'https://upwork.com',
      fiverrProfile: 'https://fiverr.com',
    },
  },
  {
    id: 'thamidu',
    name: 'Thamidu Samarasinghe',
    callsign: 'THAMIDU',
    degree: 'B.Sc. Computer Science',
    role: 'Co-Founder & Computer Science',
    gender: 'male',
    avatar: '/src/assets/images/doomdot_squad_kael_1790607208250.jpg',
    bio: 'Computer Science graduate focusing on intelligent workflows, autonomous tool integration, algorithms, and performant backend architectures.',
    stats: {
      systemArchitecture: 94,
      algorithmicVelocity: 97,
      uiPrecision: 91,
      debuggingInstinct: 95,
      caffeineTolerance: 94,
    },
    primaryWeapons: ['Python', 'TypeScript', 'FastAPI', 'Gemini API', 'PostgreSQL', 'Qdrant'],
    secondaryWeapons: ['Docker', 'PyTorch', 'Vector DBs', 'CI/CD', 'Tailwind'],
    recentShipment: {
      title: 'Autonomous Multi-Tool Agent Workflow',
      description: 'Integrated semantic RAG vectors and real-time tool orchestration.',
      commitsThisMonth: 168,
    },
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      upworkProfile: 'https://upwork.com',
      fiverrProfile: 'https://fiverr.com',
    },
  },
  {
    id: 'odhisha',
    name: 'Odhisha Rathnayaka',
    callsign: 'ODHISHA',
    degree: 'B.Sc. Computer Science',
    role: 'Co-Founder & Computer Science',
    gender: 'female',
    avatar: '/src/assets/images/doomdot_squad_zoe_1790607225000.jpg',
    bio: 'Computer Science graduate engineering intuitive user experiences, interactive 3D WebGL interfaces, seamless third-party APIs, and rigorous QA benchmarking.',
    stats: {
      systemArchitecture: 93,
      algorithmicVelocity: 95,
      uiPrecision: 98,
      debuggingInstinct: 94,
      caffeineTolerance: 92,
    },
    primaryWeapons: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'OAuth'],
    secondaryWeapons: ['Webhooks', 'Stripe API', 'Vitest', 'Framer Motion', 'Figma'],
    recentShipment: {
      title: 'Fluid Interactive Spatial Canvas',
      description: 'Delivered 60fps responsive 3D WebGL scene and micro-interactions.',
      commitsThisMonth: 162,
    },
    social: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      upworkProfile: 'https://upwork.com',
      fiverrProfile: 'https://fiverr.com',
    },
  },
];

export const SKILL_TREES: SkillTreeCategory[] = [
  {
    id: 'web-app',
    icon: '⚡',
    name: 'Web & App Development',
    tagline: 'High-speed production apps built with modern reactive state.',
    level: 'LVL 99 MASTERED',
    turnaround: '14 – 28 Days per Milestone',
    idealFor: 'Startups launching new SaaS platforms or mobile products.',
    unlockedSkills: [
      {
        name: 'Full-Stack SaaS Architecture',
        description: 'Next.js 15, React 19, TypeScript, secure authentication, and payment flows.',
        powerRating: 98,
        stack: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
      },
      {
        name: 'Responsive Modern Landing Pages',
        description: 'Micro-interactions, 60fps scroll animations, and dark-mode first aesthetic.',
        powerRating: 99,
        stack: ['Vite', 'Framer Motion', 'Tailwind'],
      },
      {
        name: 'Cross-Platform Mobile Shells',
        description: 'React Native & Expo iOS/Android apps with offline local database caching.',
        powerRating: 94,
        stack: ['React Native', 'Expo', 'SQLite', 'Zustand'],
      },
    ],
  },
  {
    id: 'custom-se',
    icon: '🛠️',
    name: 'Custom Software Engineering',
    tagline: 'Battle-hardened backends, distributed APIs, and database efficiency.',
    level: 'LVL 96 MASTERED',
    turnaround: '7 – 21 Days',
    idealFor: 'Platforms needing robust APIs, low latency, or database overhauls.',
    unlockedSkills: [
      {
        name: 'High-Throughput API Design',
        description: 'RESTful and WebSocket APIs in Go and Node handling high concurrency with sub-50ms latency.',
        powerRating: 97,
        stack: ['Go', 'Node.js', 'WebSockets', 'GraphQL'],
      },
      {
        name: 'Database Architecture & Tuning',
        description: 'PostgreSQL indexing, Redis caching, schema migrations, and query cost reduction.',
        powerRating: 96,
        stack: ['PostgreSQL', 'Redis', 'ClickHouse', 'Prisma'],
      },
      {
        name: 'Cloud & Container Pipelines',
        description: 'Docker containerization, CI/CD automated deployments, and zero-downtime rollouts.',
        powerRating: 93,
        stack: ['Docker', 'AWS', 'GitHub Actions', 'Linux'],
      },
    ],
  },
  {
    id: 'ai-cs',
    icon: '🤖',
    name: 'AI & CS Solutions',
    tagline: 'Applied machine learning, autonomous agents, and algorithmic optimization.',
    level: 'LVL 98 MASTERED',
    turnaround: '7 – 14 Days',
    idealFor: 'Teams embedding intelligent workflows or custom data algorithms.',
    unlockedSkills: [
      {
        name: 'Autonomous LLM Agents & RAG',
        description: 'Custom tool-calling agents, vector database search (Qdrant), and structured outputs.',
        powerRating: 99,
        stack: ['Python', 'FastAPI', 'Gemini API', 'Qdrant'],
      },
      {
        name: 'Workflow Automation & Scraping',
        description: 'High-volume ETL scripts, automated triage, and webhook integrations.',
        powerRating: 95,
        stack: ['Python', 'Celery', 'BeautifulSoup', 'Redis'],
      },
      {
        name: 'Algorithmic Optimization & C++',
        description: 'High-speed data structures, algorithmic complexity reduction, and graph traversal.',
        powerRating: 96,
        stack: ['C++', 'Python', 'NumPy', 'Data Structures'],
      },
    ],
  },
  {
    id: 'ui-ux',
    icon: '🎨',
    name: 'UI/UX & Prototyping',
    tagline: 'Dark-mode first, interactive, high-converting interfaces.',
    level: 'LVL 97 MASTERED',
    turnaround: '5 – 10 Days',
    idealFor: 'Founders who want to wow investors and users with unforgettable design.',
    unlockedSkills: [
      {
        name: 'AAA Gaming & Cyber HUD Design',
        description: 'Scanlines, glowing neon accents, tactile retro-modern aesthetic, and crisp specs.',
        powerRating: 99,
        stack: ['Tailwind', 'CSS Shaders', 'Figma', 'Canvas'],
      },
      {
        name: 'Interactive 3D & GLSL Shaders',
        description: 'Three.js viewports, custom particle fields, and interactive physics engines.',
        powerRating: 96,
        stack: ['Three.js', 'WebGL', 'GLSL', 'Canvas API'],
      },
      {
        name: 'Figma to Pixel-Perfect Code',
        description: 'Zero design drift. Exact implementation of layouts with fluid typography.',
        powerRating: 98,
        stack: ['React', 'TypeScript', 'Tailwind', 'Framer'],
      },
    ],
  },
];

export const CAPSTONE_PROJECTS: ProjectCaseStudy[] = [
  {
    id: 'aegisops',
    title: 'AegisOps — Distributed Cloud Telemetry Hub',
    tagline: 'Cap-Stone Project: Real-time incident mitigation & distributed metrics dashboard',
    category: 'saas',
    clientType: 'Indie Venture',
    metrics: [
      { label: 'Event Throughput', value: '140,000 / sec' },
      { label: 'Query Latency', value: '38ms median' },
      { label: 'Test Coverage', value: '98.4%' },
    ],
    challenge: 'Engineering teams needed real-time observability across 60+ microservices without high Datadog subscription overhead.',
    solution: 'Architected in Go with ClickHouse backend, paired with an ultra-responsive Next.js frontend rendering real-time SVG telemetry charts with zero frame drops.',
    stack: ['Go', 'TypeScript', 'Next.js', 'ClickHouse', 'Tailwind', 'WebSockets'],
    squadMembers: ['VALKYRIE', 'GHOST', 'CIPHER'],
    interactiveDemoType: 'chart',
  },
  {
    id: 'kroma-studio',
    title: 'Kroma Studio — Generative Shader Engine',
    tagline: 'Cap-Stone Project: Browser-based GLSL node playground for game creators',
    category: 'creative-3d',
    clientType: 'Indie Venture',
    metrics: [
      { label: 'Render Pipeline', value: '1.2s' },
      { label: 'Frame Rate', value: 'Locked 60 FPS' },
      { label: 'Indie Devs', value: '1,400+ Users' },
    ],
    challenge: 'Indie game developers struggled to prototype dynamic particle shaders without heavy native game engine installation.',
    solution: 'Developed an in-browser node graph with real-time GLSL compilation, Three.js preview canvas, and automated sprite export.',
    stack: ['React', 'Three.js', 'WebGL / GLSL', 'C++', 'WebAssembly', 'Tailwind'],
    squadMembers: ['GHOST', 'GLITCH'],
    interactiveDemoType: 'canvas',
  },
  {
    id: 'vortex-mobile',
    title: 'Vortex Crypto & Social Trading App',
    tagline: 'Cap-Stone Project: High-frequency social order execution engine',
    category: 'mobile',
    clientType: 'Fintech Beta',
    metrics: [
      { label: 'TestFlight Users', value: '12,500' },
      { label: 'Cold Start Time', value: '580ms' },
      { label: 'Crash Rate', value: '< 0.01%' },
    ],
    challenge: 'Young investors were abandoning laggy web trading platforms that lacked instant mobile haptics.',
    solution: 'Engineered an iOS and Android app with React Native & Expo, integrating biometric secure storage, real-time price websockets, and haptic feedback micro-interactions.',
    stack: ['React Native', 'Expo', 'Zustand', 'Node.js', 'Tailwind', 'WebSockets'],
    squadMembers: ['GLITCH', 'VALKYRIE'],
    interactiveDemoType: 'workflow',
  },
  {
    id: 'pulse-ai',
    title: 'PulseDesk — Autonomous AI Dispatcher',
    tagline: 'Concept Micro-App: Multi-agent support triage & semantic classifier',
    category: 'ai-backend',
    clientType: 'Agency Partner',
    metrics: [
      { label: 'Auto Resolution', value: '74% Tickets' },
      { label: 'Response Time', value: '260ms' },
      { label: 'Accuracy', value: '99.1%' },
    ],
    challenge: 'E-commerce startups were drowning in repetitive inquiries, requiring manual triage and refund calculations.',
    solution: 'Designed an automated multi-step LLM router using FastAPI and Qdrant vector search that classifies sentiment, auto-drafts refunds, and escalates edge cases.',
    stack: ['Python', 'FastAPI', 'Gemini API', 'Qdrant', 'Next.js', 'Redis'],
    squadMembers: ['CIPHER', 'VALKYRIE'],
    interactiveDemoType: 'terminal',
  },
  {
    id: 'ghost-mesh',
    title: 'GhostMesh — P2P Encrypted Code Vault',
    tagline: 'Concept Micro-App: WebRTC peer-to-peer zero-knowledge secret transmitter',
    category: 'saas',
    clientType: 'Open Source',
    metrics: [
      { label: 'Zero-Knowledge', value: '100% Client-Side' },
      { label: 'GitHub Stars', value: '2,100+' },
      { label: 'Server Memory', value: '16MB' },
    ],
    challenge: 'Remote developers needed to transmit API keys and environment variables without relying on persistent cloud databases.',
    solution: 'Crafted an end-to-end WebRTC peer-to-peer connection that encrypts data in browser memory using Web Crypto API and self-destructs upon reading.',
    stack: ['Rust WASM', 'React', 'WebRTC', 'Web Crypto', 'Tailwind'],
    squadMembers: ['GHOST', 'CIPHER'],
    interactiveDemoType: 'canvas',
  },
  {
    id: 'hyperion-checkout',
    title: 'Hyperion Core — Flash Checkout Engine',
    tagline: 'Cap-Stone Project: High-concurrency flash checkout engine for streetwear drops',
    category: 'mvp',
    clientType: 'Indie Venture',
    metrics: [
      { label: 'Peak Concurrency', value: '25,000 Users' },
      { label: 'Checkout Duration', value: '1.4s' },
      { label: 'Cart Abandonment', value: '-38%' },
    ],
    challenge: 'Client streetwear drops were crashing Shopify servers due to bot rushes and inventory race conditions.',
    solution: 'Developed a standalone checkout proxy using Redis atomic locks, server-sent queue positions, and Stripe Payment Intents.',
    stack: ['TypeScript', 'Redis', 'PostgreSQL', 'Stripe', 'Tailwind', 'Docker'],
    squadMembers: ['VALKYRIE', 'GLITCH'],
    interactiveDemoType: 'workflow',
  },
];

export const FREELANCE_TRUST_POINTS = [
  {
    title: 'Upwork & Fiverr Escrow Support',
    description: 'Hire us directly or through Upwork/Fiverr with milestone escrow protection so you only release funds when you approve the working build.',
  },
  {
    title: 'Zero Ghosting Guarantee',
    description: 'We provide daily video or text progress standups and async Loom demos so you always know what shipped today.',
  },
  {
    title: 'Clean Handover & Tests',
    description: 'Every project includes TypeScript strict typings, clean README setup instructions, and deployment automation scripts.',
  },
  {
    title: 'Continuous Availability',
    description: 'With 4 engineers working across coordinated shifts, bug fixes and urgent client blockers are handled within hours, not days.',
  },
];

export const AGENCY_COMPARISON = [
  {
    dimension: 'Communication',
    traditionalAgency: 'Filtered through 3 non-technical account managers',
    soloFreelancer: 'One person who might vanish during your crunch time',
    doomdot: 'Direct Slack / Discord with the 4 actual engineers building your code',
  },
  {
    dimension: 'Velocity',
    traditionalAgency: '6 weeks of roadmapping before writing line one',
    soloFreelancer: 'Limited to single-thread capacity; easily backlogged',
    doomdot: 'First functioning interactive prototype delivered in 72 hours',
  },
  {
    dimension: 'Team Balance',
    traditionalAgency: 'Senior dev sells you, outsourced interns write your code',
    soloFreelancer: 'Usually strong in frontend OR backend, rarely both',
    doomdot: '2 Software Engineering + 2 CS grads covering Architecture, AI, 3D & Mobile',
  },
  {
    dimension: 'Modern Stack',
    traditionalAgency: 'Bloated legacy templates, slow WordPress/PHP setups',
    soloFreelancer: 'Hit or miss dependency maintenance',
    doomdot: 'Next.js 15, React 19, TypeScript, Go, Python, C++, Three.js, Redis',
  },
  {
    dimension: 'Code Ownership',
    traditionalAgency: 'Locked in proprietary CMS or hostage maintenance retainers',
    soloFreelancer: 'Variable documentation and repo quality',
    doomdot: '100% full clean GitHub handover with docs, tests, and CI/CD pipelines',
  },
];
