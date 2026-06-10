import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter, FiGlobe } from 'react-icons/fi';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Description */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-sm">
              CC
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Code<span className="text-purple-400">Crew</span>
            </span>
          </Link>
          <p className="text-sm text-zinc-500 leading-relaxed">
            The ultimate matching platform for student developers. Find teammates, build stellar hackathon projects, and launch your next startup idea.
          </p>
          <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <FiGithub className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <FiLinkedin className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <FiTwitter className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
              <FiGlobe className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/developers" className="hover:text-white transition-colors">Find Developers</Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition-colors">Features & Benefits</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-white transition-colors">Your Invites</Link>
            </li>
          </ul>
        </div>

        {/* Resources Links */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">Hackathon Tips</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Startup Guide</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Community Discord</a>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Code of Conduct</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-650">
        <p>&copy; {new Date().getFullYear()} CodeCrew. Created for college developers everywhere.</p>
        <p className="mt-2 sm:mt-0">Built with React + Tailwind CSS v4</p>
      </div>
    </footer>
  );
};

export default Footer;
