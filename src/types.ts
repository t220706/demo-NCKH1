export interface Hotspot {
  id: string;
  x: number; // Percentage from left (0 to 100)
  y: number; // Percentage from top (0 to 100)
  label: string;
  description: string;
  depthNote?: string;
}

export interface KeyMetric {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ExplorationLayer {
  depthIndex: number;
  depthLabel: string; // e.g., "DEPTH: 15KM"
  title: string;      // e.g., "Plate 14: Volcanic Cross-Section & Magma Reservoir"
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  summary: string;
  keyMetrics: KeyMetric[];
  hotspots: Hotspot[];
  quiz: QuizQuestion[];
  suggestedNextTopics: string[];
  audioScript: string;
}

export interface ExplorationSession {
  id: string;
  topic: string;
  currentDepthIndex: number;
  totalLayers: number;
  layers: ExplorationLayer[];
  createdAt: string;
  bookmarked?: boolean;
}

export interface AppSettings {
  maxDepth: number; // 3, 5, 7
  aiDetailLevel: 'simplified' | 'standard' | 'expert';
  autoPlaySpeech: boolean;
  speechVoice: string;
}

export type TabType = 'explore' | 'history' | 'library' | 'settings';
