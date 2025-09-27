import React from 'react';
import { ConsoleLog, LogStatus } from '../types';
import { LoadingSpinner, InfoIcon, CheckCircleIcon, ExclamationTriangleIcon } from './icons/Icons';

interface ConsoleViewProps {
  logs: ConsoleLog[];
}

const LogIcon: React.FC<{ status: LogStatus }> = ({ status }) => {
  switch (status) {
    case LogStatus.WORKING:
      return <LoadingSpinner className="h-4 w-4 text-blue-500" />;
    case LogStatus.INFO:
      return <InfoIcon className="h-4 w-4 text-gray-500" />;
    case LogStatus.SUCCESS:
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    case LogStatus.ERROR:
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const ConsoleView: React.FC<ConsoleViewProps> = ({ logs }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full">
      <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3">
        Process Log
      </h3>
      <div className="space-y-2 text-sm font-mono overflow-y-auto max-h-[70vh]">
        {logs.length === 0 && (
            <p className="text-gray-400 font-sans">Waiting to start research...</p>
        )}
        {logs.map((log, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="mt-0.5">
                <LogIcon status={log.status} />
            </div>
            <div className="flex-1">
                <span className="text-gray-400 mr-2">{log.timestamp}</span>
                <span className={`
                    ${log.status === LogStatus.ERROR ? 'text-red-600' : 'text-gray-600'}
                    ${log.status === LogStatus.SUCCESS ? 'font-semibold text-green-700' : ''}
                `}>
                    {log.message}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsoleView;
