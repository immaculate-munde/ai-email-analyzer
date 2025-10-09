// src/components/LandingPage.jsx

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="w-full max-w-4xl mx-auto text-center p-8">
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-12 space-y-8 transform transition-all duration-500 hover:scale-[1.02]">

        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Scan Smarter, Not Harder
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Instantly analyze emails and messages for threats using the power of AI.
            Stop scams before they happen.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {/* Feature Card 1 */}
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="text-blue-500 dark:text-blue-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Cybersecurity Shield</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get an expert verdict on whether a message is legit, suspicious, or a scam.</p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="text-purple-500 dark:text-purple-400 mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18"/></svg>
            </div>
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">AI-Powered Analysis</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Our AI reads between the lines to detect subtle signs of phishing and fraud.</p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 transform hover:-translate-y-2 transition-transform duration-300">
            <div className="text-green-500 dark:text-green-400 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 11V3M16.24 7.76l6.36 6.36M21 12h-8M7.76 16.24l-6.36-6.36M3 12h8m4 11v-8"/></svg>
            </div>
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Generate Safe Replies</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">If a message is safe, generate a professional reply in seconds.</p>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="pt-8">
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Get Started for Free
          </button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;