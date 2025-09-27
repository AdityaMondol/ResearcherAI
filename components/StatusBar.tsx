
import React from 'react';
import { ResearchStep } from '../types';
import { STEPS_ORDER, RESEARCH_STEPS_CONFIG } from '../constants';

interface StatusBarProps {
  currentStep: ResearchStep;
}

const StatusBar: React.FC<StatusBarProps> = ({ currentStep }) => {
  const currentStepIndex = STEPS_ORDER.indexOf(currentStep);

  return (
    <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-300">Research Progress</h3>
        <div className="flex items-center justify-between">
            {STEPS_ORDER.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isActive = index === currentStepIndex;
                const stepConfig = RESEARCH_STEPS_CONFIG[step];

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`
                                h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                ${isCompleted ? 'bg-green-500 border-green-400' : ''}
                                ${isActive ? 'bg-cyan-500 border-cyan-400 animate-pulse' : ''}
                                ${!isCompleted && !isActive ? 'bg-gray-700 border-gray-600' : ''}
                            `}>
                                {stepConfig.icon}
                            </div>
                            <p className={`
                                mt-2 text-xs font-medium
                                ${isActive || isCompleted ? 'text-cyan-300' : 'text-gray-500'}
                            `}>
                                {stepConfig.text}
                            </p>
                        </div>
                        {index < STEPS_ORDER.length - 1 && (
                            <div className={`
                                flex-1 h-1 mx-2 rounded-full
                                ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}
                            `}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
  );
};

export default StatusBar;
