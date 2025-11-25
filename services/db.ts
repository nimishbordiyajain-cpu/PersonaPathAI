import { SavedReport, UserDetails, PersonalityReport, Feedback } from "../types";

const DB_KEY = 'personapath_db_v1';

export const dbService = {
  saveReport: (userDetails: UserDetails, report: PersonalityReport): string => {
    const reports = dbService.getReports();
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    
    const newReport: SavedReport = {
      id,
      timestamp: Date.now(),
      userDetails,
      report
    };

    localStorage.setItem(DB_KEY, JSON.stringify([newReport, ...reports]));
    return id;
  },

  getReports: (): SavedReport[] => {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load DB", e);
      return [];
    }
  },

  addFeedback: (reportId: string, rating: number, comment: string) => {
    const reports = dbService.getReports();
    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          feedback: {
            rating,
            comment,
            timestamp: Date.now()
          }
        };
      }
      return r;
    });
    localStorage.setItem(DB_KEY, JSON.stringify(updatedReports));
  },

  getStats: () => {
    const reports = dbService.getReports();
    const totalReports = reports.length;
    const ratings = reports.filter(r => r.feedback).map(r => r.feedback!.rating);
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) 
      : 'N/A';
    
    return { totalReports, avgRating };
  },

  authenticate: (password: string): boolean => {
    return password === 'admin123';
  }
};
