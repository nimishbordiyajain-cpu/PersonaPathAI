import React, { useState } from 'react';
import { Button } from './Button';
import { UserDetails } from '../types';
import { UserCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface UserDetailsFormProps {
  onSubmit: (details: UserDetails) => void;
  onBack: () => void;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age && gender) {
      onSubmit({ name, age, gender });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-white/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
            <UserCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
          <p className="text-gray-600">This helps our AI tailor the analysis specifically to you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white text-gray-900"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white text-gray-900"
                placeholder="Years"
                min="1"
                max="120"
                required
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white text-gray-900"
                required
              >
                <option value="" disabled>Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </Button>
            <Button 
              type="submit" 
              className="flex-[2]"
            >
              Start Quiz <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};