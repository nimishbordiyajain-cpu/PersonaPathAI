import React, { useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { SavedReport } from '../types';
import { Button } from './Button';
import { Results } from './Results';
import { ArrowLeft, Lock, Star, Users, MessageSquare, Download, Eye, FileDown, X, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [error, setError] = useState(false);
  
  // View/PDF States
  const [viewReport, setViewReport] = useState<SavedReport | null>(null);
  const [pdfReport, setPdfReport] = useState<SavedReport | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setReports(dbService.getReports());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (dbService.authenticate(password)) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Name', 'Age', 'Gender', 'Personality', 'Character', 'Rating', 'Comment'];
    const rows = reports.map(r => [
      new Date(r.timestamp).toLocaleDateString(),
      r.userDetails.name,
      r.userDetails.age,
      r.userDetails.gender,
      r.report.personality_type.title,
      r.report.fictional_match.character,
      r.feedback?.rating || '',
      `"${r.feedback?.comment || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "personapath_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfDownload = (report: SavedReport) => {
    setPdfReport(report);
    // Slight delay to allow the hidden component to render
    setTimeout(async () => {
      const element = document.getElementById('admin-hidden-report');
      if (!element) {
        console.error("Could not find hidden report element");
        setPdfReport(null);
        return;
      }

      try {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: [imgWidth, imgHeight]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${report.userDetails.name}_Report.pdf`);
      } catch (err) {
        console.error("Admin PDF Generation failed:", err);
        alert("Failed to generate PDF");
      } finally {
        setPdfReport(null);
      }
    }, 500); // 500ms delay to ensure rendering
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gray-100 rounded-full text-gray-500">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white text-gray-900 placeholder:text-gray-400"
                placeholder="Enter password"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">Incorrect password</p>}
            </div>
            <Button type="submit" fullWidth>Login</Button>
            <Button type="button" variant="secondary" fullWidth onClick={onBack}>
              Cancel
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const stats = dbService.getStats();

  return (
    <div className="animate-fade-in relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={onBack} className="!p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>
        <Button onClick={downloadCSV} variant="outline" className="hidden md:flex">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Users className="w-5 h-5" /> Total Reports
          </div>
          <div className="text-3xl font-bold text-indigo-600">{stats.totalReports}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Star className="w-5 h-5" /> Avg Rating
          </div>
          <div className="text-3xl font-bold text-yellow-500">{stats.avgRating}</div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Result</th>
                <th className="p-4 font-medium text-center">Rating</th>
                <th className="p-4 font-medium">Feedback</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{report.userDetails.name}</div>
                    <div className="text-xs text-gray-500">{report.userDetails.age} • {report.userDetails.gender}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-indigo-600">{report.report.personality_type.title}</div>
                    <div className="text-xs text-gray-500">{report.report.fictional_match.character}</div>
                  </td>
                  <td className="p-4 text-center">
                    {report.feedback ? (
                      <div className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold">
                        <Star className="w-3 h-3 fill-yellow-700" /> {report.feedback.rating}
                      </div>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                    {report.feedback?.comment ? (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span title={report.feedback.comment}>{report.feedback.comment}</span>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs italic">No comment</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setViewReport(report)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Full Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePdfDownload(report)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download PDF"
                        disabled={!!pdfReport}
                      >
                         {pdfReport?.id === report.id ? (
                           <Loader2 className="w-4 h-4 animate-spin" />
                         ) : (
                           <FileDown className="w-4 h-4" />
                         )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    No reports generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="font-bold text-gray-900">Report Preview: {viewReport.userDetails.name}</h3>
              <button 
                onClick={() => setViewReport(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 md:p-8 bg-slate-50">
              <Results 
                report={viewReport.report} 
                userDetails={viewReport.userDetails} 
                onRetake={() => {}} 
                reportId={null} 
                isReadOnly={true} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden Render Container for PDF Generation */}
      {pdfReport && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '1000px', zIndex: -1 }}>
          <Results 
            report={pdfReport.report} 
            userDetails={pdfReport.userDetails} 
            onRetake={() => {}} 
            reportId={null} 
            isReadOnly={true}
            domId="admin-hidden-report"
          />
        </div>
      )}
    </div>
  );
};