export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP';

export type MBTIPole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export type AlertLevel = 'green' | 'yellow' | 'red';

export interface BaseQuestion {
  id: number;
  dimension: MBTIDimension;
  targetPoles: [MBTIPole, MBTIPole];
  scenarioTitle: string;
  scenarioText: string;
  contextHint: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
  stage: 'setup' | 'base_question' | 'stress_followup' | 'evaluating' | 'ready_for_report';
  questionId?: number;
  dimension?: MBTIDimension;
  isStressTest?: boolean;
  stressTargetDimension?: string;
}

export interface RadarScores {
  E: number; // 0 - 100
  I: number; // 0 - 100
  S: number; // 0 - 100
  N: number; // 0 - 100
  T: number; // 0 - 100
  F: number; // 0 - 100
  J: number; // 0 - 100
  P: number; // 0 - 100
}

export interface DetectiveReport {
  dossierId: string;
  evaluatedAt: string;
  candidateName: string;
  jobTitle: string;
  
  // MBTI
  predictedMBTI: string; // e.g. "ENTP", "INFP"
  mbtiTitle: string; // e.g. "敏捷智多星 / 辯論家"
  mbtiSummary: string; // concise description of this personality in workplace

  // Honesty & Alert
  alertLevel: AlertLevel; // green, yellow, red
  honestyScore: number; // 0 - 100%
  discrepancyGap: number; // 0 - 100% (packaging gap)
  detectiveVerdict: string; // Forensics summary verdict

  // Radar Data
  baselineScores: RadarScores; // Initial packaged scores
  convergentScores: RadarScores; // Real stress-tested scores
  dimensionDeltas: {
    dimension: string;
    label: string;
    baseline: number;
    convergent: number;
    gap: number;
    isSuspect: boolean;
  }[];

  // Distinct behavioral traits
  dominantTraits: {
    title: string;
    tag: string;
    behaviorDesc: string;
    teamRoleStyle: string;
    managementAdvice: string;
  }[];

  // Camouflage Analysis (Core highlight)
  camouflageAnalysis: {
    suspectDimension: string;
    discrepancyDetail: string; // e.g. "在第 4 題刻意強調其高條理性（J），但在第二輪壓力追問時，其思維本能更偏向彈性應變（P）"
    psychologicalMotive: string; // e.g. "迎合專案經理職缺對進度控管的刻板印象"
    workplaceRisk: string; // potential friction in the team
  };

  // HR Interview Follow-up Guide
  hrInterviewGuide: {
    sharpQuestion: string; // 1 targeted sharp question for HR to verify in person
    observationPoints: string[]; // what to watch out for
    recommendedVerificationTech: string; // specific interview technique
  };
}

export interface PresetCase {
  id: string;
  title: string;
  badge: string;
  candidateName: string;
  jobTitle: string;
  description: string;
  expectedAlert: AlertLevel;
  answers: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    followup1?: string;
    followup2?: string;
  };
}
