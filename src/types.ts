/**
 * TypeScript Type Definitions for Stack Architect
 */

export interface StackItem {
  id: string;
  name: string;
  frontend: string;
  backend: string;
  api: string;
  runtimeProcess: string;
  database: string;
  styles: string;
  dbAccess: string;
  auth: string;
  deployment: string;
  proxy: string;
  monitoring: string;
  complexity: 'Easy' | 'Medium' | 'Hard';
  description: string;
  recommended: boolean;
  idealUse: string;
}

export interface DecisionStepOption {
  id: string;
  label: string;
  desc: string;
  badge?: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
  popularity: number;
  nextHints?: Record<string, string>;
}

export interface DecisionStep {
  step: number;
  title: string;
  subtitle: string;
  options: DecisionStepOption[];
}

export interface WizardAnswers {
  appName: string;
  appType: string;
  teamExp: string;
  hostingGoal: string;
  stylePrefer: string;
  customerTarget?: 'hobby' | 'growing' | 'enterprise';
  dataSize?: 'small-structured' | 'large-unstructured' | 'heavy-media-files';
  budgetLimit?: 'zero-free' | 'low-vps' | 'high-managed';
  aiRequirement?: 'no-ai' | 'vector-rag' | 'agent-websockets';
  devPersona?: 'vibe-casual' | 'ts-engineer' | 'python-data' | 'indie-hacker' | 'systems-nerd';
}
