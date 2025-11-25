import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  "Analyzing your choices...",
  "Consulting the psychological archives...",
  "Searching fictional multiverses...",
  "Crafting your unique profile...",
  "Almost there..."
];

export const Loading: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-ping"></div>
        <div className="relative bg-white p-6 rounded-full shadow-xl">
          <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        {MESSAGES[msgIndex]}
      </h2>
      <p className="text-gray-500 max-w-md">
        Our AI is weaving together your answers to reveal your true persona.
      </p>
    </div>
  );
};
