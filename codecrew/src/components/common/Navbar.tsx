import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiUsers, FiLayout, FiBookOpen } from 'react-icons/fi';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-purple/15 text-purple-300 border border-brand-purple/30'
        : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-brand-purple/20 text-purple-300 border border-brand-purple/35'
        : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-zinc-800/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-purple/30 group-hover:scale-105 transition-transform duration-200">
              CC
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors duration-200">
              Code<span className="text-purple-400">Crew</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/developers" className={navLinkClass}>
              Developers
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 py-1.5 px-3 rounded-full">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-6 w-6 rounded-full object-cover border border-zinc-700"
                  />
                  <span className="text-xs font-semibold text-zinc-300 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 border border-zinc-800 hover:border-red-500/30 text-zinc-400 hover:text-red-400 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-zinc-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-purple-600 hover:to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-brand-purple/20 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 focus:outline-none transition-colors"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-zinc-850 animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
              <FiBookOpen className="h-5 w-5" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/developers" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
              <FiUsers className="h-5 w-5" />
              <span>Developers</span>
            </NavLink>
            {currentUser && (
              <>
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                  <FiLayout className="h-5 w-5" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/profile" onClick={() => setIsOpen(false)} className={mobileNavLinkClass}>
                  <FiUser className="h-5 w-5" />
                  <span>Profile</span>
                </NavLink>
              </>
            )}
            
            <div className="pt-4 pb-2 border-t border-zinc-800 mt-4">
              {currentUser ? (
                <div className="px-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-10 w-10 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <div className="text-sm font-bold text-white">{currentUser.name}</div>
                      <div className="text-xs text-zinc-500">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-zinc-800 hover:border-red-500/40 text-zinc-300 hover:text-red-400 rounded-xl text-sm font-semibold transition-all duration-200"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2 flex flex-col">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 text-zinc-300 hover:text-white border border-zinc-800 hover:bg-zinc-800/50 rounded-xl text-sm font-semibold transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
