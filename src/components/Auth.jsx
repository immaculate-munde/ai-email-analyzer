// src/components/Auth.jsx

import { useState } from 'react';
// UPDATED: Import everything from your local config file
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from '../firebase/config'; // Note the ../ to go up one directory

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  // ... the rest of your Auth.jsx component remains exactly the same
  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginView) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl shadow-2xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-200">
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 dark:border-slate-600"
        >
          <svg className="w-6 h-6" xmlns="http://www.w.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.612-3.512-11.284-8.288l-6.521 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.059 34.637 44 29.825 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
          Sign in with Google
        </button>

        <div className="flex items-center">
          <hr className="w-full border-slate-300 dark:border-slate-600" />
          <span className="px-2 text-slate-500 dark:text-slate-400 text-sm">OR</span>
          <hr className="w-full border-slate-300 dark:border-slate-600" />
        </div>

        <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
            {isLoginView ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          {isLoginView ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-1">
            {isLoginView ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;