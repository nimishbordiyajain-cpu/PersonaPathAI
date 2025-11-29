import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Button } from './Button';
import { BrainCircuit, LogIn, UserPlus, AlertCircle, Shield, User } from 'lucide-react';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('Regular User');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Here you would typically handle the 'accountType' preferences
        // e.g., save to a database profile
        console.log(`User created. Role: ${accountType}`);
      }
    } catch (err) {
      const firebaseError = err as AuthError;
      let errorMessage = "An error occurred. Please try again.";
      
      switch (firebaseError.code) {
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No user found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
          break;
        case 'auth/email-already-in-use':
          errorMessage = "Email is already in use.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/Password login is not enabled in Firebase Console.";
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
          <BrainCircuit size={32} />
        </div>
        <span className="text-3xl font-bold tracking-tight text-gray-900">
          Persona<span className="text-indigo-600">Path</span> AI
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-md border border-white/50 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Join Our Community'}
        </h2>
        <p className="text-gray-500 mb-8">
          {isLogin 
            ? 'Enter your credentials to access your dashboard.' 
            : 'Create an account to discover your personality type.'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white text-gray-900"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white text-gray-900"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Type</label>
              <div className="relative">
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="Regular User">Regular User</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  {accountType === 'Admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            className="mt-6"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && (isLogin ? <LogIn className="w-4 h-4 ml-2" /> : <UserPlus className="w-4 h-4 ml-2" />)}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};