// src/App.jsx

import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from './firebase/config';

// Import your top-level components
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setShowAuth(false); // Reset to landing page on logout
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl dark:text-white">Loading...</div>;
  }

  const renderContent = () => {
    if (user) {
      return <Dashboard />;
    }
    
    if (showAuth) {
      return <Auth />;
    } else {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
  };

  return (
    // UPDATED: Simplified the className for robust centering
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      {renderContent()}
    </main>
  );
}

export default App;