
import React from 'react';
import { ResearchStep } from './types';
import { SearchIcon, SummarizeIcon, DebateIcon, PaperIcon, DoneIcon } from './components/icons/Icons';

export const RESEARCH_STEPS_CONFIG = {
  [ResearchStep.GENERATING_QUERIES]: {
    text: 'Generating Queries',
    icon: <SearchIcon className="h-6 w-6" />,
  },
  [ResearchStep.SUMMARIZING]: {
    text: 'Synthesizing Data',
    icon: <SummarizeIcon className="h-6 w-6" />,
  },
  [ResearchStep.DEBATING]: {
    text: 'Agentic Debate',
    icon: <DebateIcon className="h-6 w-6" />,
  },
  [ResearchStep.GENERATING_PAPER]: {
    text: 'Generating Paper',
    icon: <PaperIcon className="h-6 w-6" />,
  },
  [ResearchStep.DONE]: {
    text: 'Complete',
    icon: <DoneIcon className="h-6 w-6" />,
  },
};

export const STEPS_ORDER: ResearchStep[] = [
  ResearchStep.GENERATING_QUERIES,
  ResearchStep.SUMMARIZING,
  ResearchStep.DEBATING,
  ResearchStep.GENERATING_PAPER,
  ResearchStep.DONE,
];
