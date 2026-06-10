import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements (Glow effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-indigo/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-5%] w-[35%] h-[35%] rounded-full bg-brand-pink/5 blur-[100px] pointer-events-none"></div>

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
