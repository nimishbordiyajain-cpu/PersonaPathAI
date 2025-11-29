import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { AppState, PersonalityReport, UserDetails } from './types';
import { Quiz } from './components/Quiz';
import { Loading } from './components/Loading';
import { Results } from './components/Results';
import { Button } from './components/Button';
import { UserDetailsForm } from './components/UserDetailsForm';
import { AdminPanel } from './components/AdminPanel';
import { Login } from './components/Login';
import { generateReport } from './services/geminiService';
import { dbService } from './services/db';
import { BrainCircuit, Sparkles, Lock, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [report, setReport] = useState<PersonalityReport | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Reset app state on logout
      setAppState(AppState.WELCOME);
      setReport(null);
      setUserDetails(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const startAnalysis = () => {
    setAppState(AppState.USER_DETAILS);
    setErrorMsg(null);
  };

  const handleUserDetailsSubmit = (details: UserDetails) => {
    setUserDetails(details);
    setAppState(AppState.QUIZ);
  };

  const handleQuizComplete = async (answers: { question: string; answer: string }[]) => {
    if (!userDetails) return;

    setAppState(AppState.LOADING);
    try {
      const result = await generateReport(answers, userDetails);
      
      // Save to local database automatically
      const newId = dbService.saveReport(userDetails, result);
      
      setReport(result);
      setReportId(newId);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong while analyzing your personality. Please try again.");
      setAppState(AppState.ERROR);
    }
  };

  const handleRetake = () => {
    setReport(null);
    setReportId(null);
    setUserDetails(null);
    setAppState(AppState.WELCOME);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState(AppState.WELCOME)}>
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <BrainCircuit size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Persona<span className="text-indigo-600">Path</span> AI
            </span>
          </div>
          <div className="flex gap-4 items-center">
             {appState !== AppState.WELCOME && appState !== AppState.ADMIN && (
               <button onClick={handleRetake} className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                 Start Over
               </button>
             )}
             <button 
               onClick={handleLogout}
               className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 ml-2"
               title="Sign Out"
             >
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          
          {appState === AppState.WELCOME && (
            <div className="flex flex-col items-center text-center justify-center min-h-[70vh] animate-fade-in-up">
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm">
                <Sparkles className="w-4 h-4" /> Powered by Gemini 2.5 Flash
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight max-w-4xl">
                Discover Your True <br/>
                <span className="gradient-text">Personality & Career</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                Take our short, interactive quiz. Our AI psychologist analyzes your traits to reveal your strengths, ideal career paths, and even your fictional soulmate.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={startAnalysis} className="text-lg px-10 py-4 shadow-xl shadow-indigo-200">
                  Start Analysis
                </Button>
              </div>

              {/* Decorative elements */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-3xl border-t border-gray-200 pt-10">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Deep Insight</h3>
                  <p className="text-sm text-gray-500">Goes beyond basic archetypes to understand your motivations.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Career Focus</h3>
                  <p className="text-sm text-gray-500">Actionable career advice tailored to your working style.</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Fun & Engaging</h3>
                  <p className="text-sm text-gray-500">Find out which fictional universe you truly belong in.</p>
                </div>
              </div>
            </div>
          )}

          {appState === AppState.USER_DETAILS && (
            <UserDetailsForm 
              onSubmit={handleUserDetailsSubmit} 
              onBack={() => setAppState(AppState.WELCOME)}
            />
          )}

          {appState === AppState.QUIZ && (
            <Quiz onComplete={handleQuizComplete} />
          )}

          {appState === AppState.LOADING && (
            <Loading />
          )}

          {appState === AppState.RESULTS && report && userDetails && (
            <Results 
              report={report} 
              userDetails={userDetails} 
              reportId={reportId}
              onRetake={handleRetake} 
            />
          )}

          {appState === AppState.ADMIN && (
            <AdminPanel onBack={() => setAppState(AppState.WELCOME)} />
          )}
          
          {appState === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
              <p className="text-gray-600 mb-6 max-w-md">{errorMsg}</p>
              <Button onClick={startAnalysis}>Try Again</Button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100 no-print flex flex-col items-center gap-4">
        <p>© {new Date().getFullYear()} PersonaPath AI. Built with React & Google Gemini.</p>
        
        {appState !== AppState.ADMIN && (
          <button 
            onClick={() => setAppState(AppState.ADMIN)} 
            className="flex items-center gap-1 text-gray-300 hover:text-indigo-500 transition-colors text-xs"
          >
            <Lock className="w-3 h-3" /> Admin Login
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;