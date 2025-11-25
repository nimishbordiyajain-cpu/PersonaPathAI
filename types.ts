
export interface Option {
  id: string;
  text: string;
  value: string; // The implied trait or simple identifier
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
}

export interface UserDetails {
  name: string;
  age: string;
  gender: string;
}

export interface PersonalityReport {
  personality_type: {
    title: string;
    description: string;
  };
  strengths: {
    name: string;
    description: string;
  }[];
  career_suggestions: {
    role: string;
    why_fit: string;
  }[];
  fictional_match: {
    character: string;
    universe: string;
    reason: string;
  };
}

export interface Feedback {
  rating: number;
  comment: string;
  timestamp: number;
}

export interface SavedReport {
  id: string;
  timestamp: number;
  userDetails: UserDetails;
  report: PersonalityReport;
  feedback?: Feedback;
}

export enum AppState {
  WELCOME = 'WELCOME',
  USER_DETAILS = 'USER_DETAILS',
  QUIZ = 'QUIZ',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR',
  ADMIN = 'ADMIN'
}
