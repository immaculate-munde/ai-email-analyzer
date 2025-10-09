// src/components/Dashboard.jsx

import { auth, signOut } from '../firebase/config';
import Analyzer from './Analyzer';

const Dashboard = () => {
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth).catch(err => console.error(err));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Welcome, {user.displayName || user.email}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Let's check for threats.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </header>
      
      <main>
        <Analyzer />
        {/* We can add the 'Saved Emails' view here later */}
      </main>
    </div>
  );
};

export default Dashboard;