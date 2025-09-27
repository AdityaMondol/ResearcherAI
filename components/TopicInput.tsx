import React, { useState } from 'react';
import { LoadingSpinner } from './icons/Icons';

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(topic);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter research topic, e.g., 'The Future of Quantum Computing'"
          className="flex-grow bg-gray-50 border border-gray-300 rounded-md py-3 px-4 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading || !topic.trim()}
        >
          {isLoading ? <LoadingSpinner className="h-5 w-5" /> : 'Start Research'}
        </button>
      </form>
    </div>
  );
};

export default TopicInput;