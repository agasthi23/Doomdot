export type Role = 'Lead Architect' | 'Creative Tech & 3D' | 'AI & Algorithms' | 'Mobile & Frontend' | 'Co-Founder & Software Engineer' | string;

export interface SquadMember {
  id: string;
  name: string;
  callsign: string;
  degree: string;
  role: Role;
  gender: 'female' | 'male';
  bio: string;
  avatar: string;
  stats: {
    systemArchitecture: number; // 0-100
    algorithmicVelocity: number;
    uiPrecision: number;
    debuggingInstinct: number;
    caffeineTolerance: number;
  };
  primaryWeapons: string[];
  secondaryWeapons: string[];
  recentShipment: {
    title: string;
    description: string;
    commitsThisMonth: number;
  };
  social: {
    github: string;
    linkedin: string;
    fiverrProfile?: string;
    upworkProfile?: string;
  };
}

export interface ProjectCaseStudy {
  id: string;
  title: string;
  tagline: string;
  category: 'saas' | 'ai-backend' | 'mobile' | 'creative-3d' | 'mvp';
  clientType: 'Indie Venture' | 'US Tech Startup' | 'Fintech Beta' | 'Open Source' | 'Agency Partner';
  metrics: {
    label: string;
    value: string;
  }[];
  challenge: string;
  solution: string;
  stack: string[];
  squadMembers: string[]; // callsigns
  previewImage?: string;
  interactiveDemoType: 'terminal' | 'chart' | 'canvas' | 'workflow';
  liveUrl?: string;
  githubUrl?: string;
}

export interface ServiceQuest {
  id: string;
  number: string;
  title: string;
  description: string;
  turnaround: string;
  deliverables: string[];
  idealFor: string;
  stack: string[];
}

export interface EstimatorSelection {
  projectType: string;
  deliverableScope: string[];
  timeline: string;
  platforms: string[];
  supportPlan: string;
}

export interface TerminalEntry {
  id: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  content: string;
  timestamp?: string;
}
