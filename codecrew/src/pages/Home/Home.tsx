import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCpu, FiAward, FiArrowRight } from 'react-icons/fi';

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto py-12 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-purple/20 blur-[100px] rounded-full -z-10"></div>
        
        <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 py-1.5 px-4 rounded-full text-xs font-medium text-zinc-300">
          <span className="flex h-2 w-2 rounded-full bg-brand-pink animate-pulse"></span>
          <span>Connecting 10,000+ Student Builders</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          Build Your <span className="gradient-text">Dream Team</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Find college hackers, co-founders, and collaborators to bring your ideas to life. Filter by skills, colleges, and shared project goals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/developers"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-2xl text-base shadow-xl shadow-brand-purple/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Find Teammates</span>
            <FiArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Create Profile</span>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass-panel border border-zinc-800/50 rounded-3xl p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          <div className="pt-6 md:pt-0">
            <p className="text-3xl md:text-4xl font-extrabold text-white">50+</p>
            <p className="text-xs md:text-sm text-zinc-500 font-semibold uppercase tracking-wider mt-1">Colleges Represented</p>
          </div>
          <div className="pt-6 md:pt-0">
            <p className="text-3xl md:text-4xl font-extrabold text-white">2,500+</p>
            <p className="text-xs md:text-sm text-zinc-500 font-semibold uppercase tracking-wider mt-1">Teams Formed</p>
          </div>
          <div className="pt-6 md:pt-0">
            <p className="text-3xl md:text-4xl font-extrabold text-white">400+</p>
            <p className="text-xs md:text-sm text-zinc-500 font-semibold uppercase tracking-wider mt-1">Hackathons Matched</p>
          </div>
          <div className="pt-6 md:pt-0">
            <p className="text-3xl md:text-4xl font-extrabold text-white">10,000+</p>
            <p className="text-xs md:text-sm text-zinc-500 font-semibold uppercase tracking-wider mt-1">Skill Connections</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
            How CodeCrew Works
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            We bypass the stress of working alone. Find the perfect teammates tailored to your specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass-panel border border-zinc-800/50 rounded-2xl p-8 hover:border-brand-purple/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-brand-purple/10 border border-brand-purple/35 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-105 transition-transform duration-200">
              <FiUsers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Find Hackathon Buddies</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              filter developers by skills like React, PyTorch, Swift, and invite them directly to your project team with a single click.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel border border-zinc-800/50 rounded-2xl p-8 hover:border-brand-pink/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-brand-pink/10 border border-brand-pink/35 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-105 transition-transform duration-200">
              <FiCpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Launch Startup MVPs</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Find co-founders with complementary technical skills. Match designers with engineers and AI models builders.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel border border-zinc-800/50 rounded-2xl p-8 hover:border-brand-cyan/30 transition-all duration-300 group">
            <div className="h-12 w-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/35 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-105 transition-transform duration-200">
              <FiAward className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Class Project Partners</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Group up with reliable peers from your university who have matching work ethics, schedules, and experience.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative rounded-3xl overflow-hidden py-16 px-8 text-center bg-gradient-to-r from-brand-purple/20 via-zinc-950 to-brand-indigo/20 border border-brand-purple/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.08),transparent)] pointer-events-none"></div>
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Ready to Build?
          </h2>
          <p className="text-zinc-350 text-sm md:text-base leading-relaxed">
            Join CodeCrew today and find the teammates that will push your project to the finish line.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-zinc-900 hover:bg-zinc-100 font-bold rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Sign Up Now
            </Link>
            <Link
              to="/developers"
              className="w-full sm:w-auto px-8 py-3.5 border border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-sm font-semibold hover:bg-zinc-900 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              Browse Profiles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
