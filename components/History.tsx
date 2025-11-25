import React from 'react';
import { SavedReport } from '../types';
import { Button } from './Button';
import { Calendar, Trash2, ArrowRight, User, ArrowLeft, Frown } from 'lucide-react';

interface HistoryProps {
  reports: SavedReport[];
  onSelectReport: (report: SavedReport) => void;
  onDeleteReport: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
  onBack: () => void;
}

export const History: React.FC<HistoryProps> = ({ 
  reports, 
  onSelectReport, 
  onDeleteReport, 
  onClearHistory,
  onBack 
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <Button variant="secondary" onClick={onBack} className="mb-4 md:mb-0 md:hidden w-full">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Analysis History</h2>
          <p className="text-gray-500">View past personality reports.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="secondary" onClick={onBack} className="hidden md:flex">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          {reports.length > 0 && (
            <Button variant="outline" onClick={onClearHistory} className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300">
              <Trash2 className="w-4 h-4" /> Clear All
            </Button>
          )}
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100 flex flex-col items-center justify-center">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <Frown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No history yet</h3>
          <p className="text-gray-500 mb-6">Complete a quiz to save your first result!</p>
          <Button onClick={onBack}>Start New Analysis</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reports.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectReport(item)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
                <button 
                  onClick={(e) => onDeleteReport(item.id, e)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                  title="Delete this report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                   <User className="w-4 h-4 text-indigo-500" />
                   <span className="font-semibold text-gray-900">{item.userDetails.name}</span>
                   <span className="text-gray-400 text-sm">({item.userDetails.age}, {item.userDetails.gender})</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-600 transition-colors">
                  {item.report.personality_type.title}
                </h3>
              </div>

              <div className="flex items-center text-sm text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">
                View Full Report <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};