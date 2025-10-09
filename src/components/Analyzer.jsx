// src/components/Analyzer.jsx

import { useState } from 'react';
import { functions, db, auth } from '../firebase/config';
import { httpsCallable } from 'firebase/functions';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Analyzer = () => {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (content.trim() === '') {
      setError('Please paste some content to analyze.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);

    const analyzeEmailFunction = httpsCallable(functions, 'analyzeEmail');
    try {
      const systemInstruction = `You are a cybersecurity expert. Analyze the provided email. Your response MUST be in this exact format:\nVerdict: [LEGIT/SUSPICIOUS/SCAM]\nReport:\n- [Point 1]\n- [Point 2]`;
      const response = await analyzeEmailFunction({ prompt: content, systemInstruction });
      
      const text = response.data.text;
      const verdictMatch = text.match(/Verdict: (LEGIT|SUSPICIOUS|SCAM)/);
      const reportMatch = text.split(/Report:/);
      
      setResult({
        verdict: verdictMatch ? verdictMatch[1] : 'Error',
        report: reportMatch[1] ? reportMatch[1].trim() : "No detailed report generated.",
        fullText: content
      });

    } catch (err) {
      setError('Failed to analyze content. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !auth.currentUser) return;
    try {
        const collectionPath = `users/${auth.currentUser.uid}/scanned_emails`;
        await addDoc(collection(db, collectionPath), {
            content: result.fullText,
            verdict: result.verdict,
            report: result.report,
            createdAt: serverTimestamp()
        });
        alert('Analysis saved!');
    } catch (e) {
        console.error("Error saving document: ", e);
        alert('Could not save analysis.');
    }
  };
  
  const getVerdictClass = (verdict) => {
    switch (verdict) {
      case 'LEGIT': return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case 'SUSPICIOUS': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case 'SCAM': return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6">
      <div>
        <label htmlFor="email-content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Content to Analyze
        </label>
        <textarea
          id="email-content"
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Paste the full email or message content here..."
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Content'}
        </button>
      </div>
      
      {error && <p className="text-red-500 text-center">{error}</p>}

      {result && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Analysis Report</h2>
            <button onClick={handleSave} className="bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-700">Save</button>
          </div>
          <div>
            <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getVerdictClass(result.verdict)}`}>
              {result.verdict}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 space-y-2">
            <ul className="list-disc list-inside space-y-1">
              {result.report.split('- ').filter(line => line.trim() !== '').map((line, index) => <li key={index}>{line.trim()}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;