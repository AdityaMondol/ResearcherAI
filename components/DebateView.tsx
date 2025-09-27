import React from 'react';
import { DebateTurn } from '../types';
import { CriticIcon, RefinerIcon } from './icons/Icons';

interface DebateViewProps {
  turns: DebateTurn[];
}

const DebateView: React.FC<DebateViewProps> = ({ turns }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Agent Debate Log</h3>
      <div className="space-y-6">
        {turns.map((turn, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className={`
              mt-1 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
              ${turn.agent === 'Critic' ? 'bg-red-100' : 'bg-green-100'}
            `}>
              {turn.agent === 'Critic' ? <CriticIcon className="h-6 w-6 text-red-600" /> : <RefinerIcon className="h-6 w-6 text-green-600" />}
            </div>
            <div>
              <p className={`font-bold ${turn.agent === 'Critic' ? 'text-red-600' : 'text-green-600'}`}>
                {turn.agent} Agent
              </p>
              <div className="text-gray-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: turn.text.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebateView;