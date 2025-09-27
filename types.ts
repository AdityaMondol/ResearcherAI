// FIX: Add missing ResearchStep enum.
export enum ResearchStep {
  GENERATING_QUERIES = 'GENERATING_QUERIES',
  SUMMARIZING = 'SUMMARIZING',
  DEBATING = 'DEBATING',
  GENERATING_PAPER = 'GENERATING_PAPER',
  DONE = 'DONE',
}

export enum LogStatus {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WORKING = 'WORKING',
}

export interface ConsoleLog {
  message: string;
  status: LogStatus;
  timestamp: string;
}

export interface DebateTurn {
  agent: 'Critic' | 'Refiner';
  text: string;
}

export interface PaperSource {
  uri: string;
  title: string;
}