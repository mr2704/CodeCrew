import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

export const Login: React.FC = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          'An error occurred during login. Please try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-panel border border-zinc-800/80 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-brand-purple/20">
            CC
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight font-display">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Find your crew and keep building.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-red-950/40 border border-red-500/20 text-red-300 p-4 rounded-xl text-sm">
            <FiAlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-purple/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;