import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import LearningPaths from '../components/LearningPaths/LearningPaths';
import PopularTracks from '../components/PopularTracks/PopularTracks';
import Footer from '../components/Footer/Footer';

const Home = ({ onNavigate, isAuthenticated, onLogout }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (courseName) => {
    onNavigate('roadmap', courseName);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 font-sans transition-colors duration-300">
      <Navbar onNavigate={onNavigate} isAuthenticated={isAuthenticated} onLogout={onLogout} />
      
      <main className="flex-grow pt-24 pb-12">
        <LearningPaths onCardClick={handleCardClick} />
        <PopularTracks onCardClick={handleCardClick} />
      </main>

      <Footer />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-700 hover:-translate-y-1 transition-all z-50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default Home;
