import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { Button } from './Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface QuizProps {
  onComplete: (answers: { question: string; answer: string }[]) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleNext = () => {
    if (!selectedOptionId) return;

    const selectedOption = currentQuestion.options.find(opt => opt.id === selectedOptionId);
    if (!selectedOption) return;

    const newAnswers = [
      ...answers,
      { question: currentQuestion.question, answer: selectedOption.text }
    ];

    setAnswers(newAnswers);
    setSelectedOptionId(null);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          <span>Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 mb-8 border border-white/50 animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 leading-tight">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                ${selectedOptionId === option.id 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md scale-[1.01]' 
                  : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <span className="font-medium text-lg">{option.text}</span>
              {selectedOptionId === option.id && (
                <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0 ml-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext} 
          disabled={!selectedOptionId}
          className="text-lg px-8"
        >
          {currentQuestionIndex === QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
