import React, { useState } from 'react';
import Landing from './pages/Landing';
import Home from './pages/Home';
import RoadmapPage from './pages/RoadmapPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AnimatedRobot from './components/AnimatedRobot';

function App() {
  // Start on the pre-login landing page
  const [view, setView] = useState({ page: 'landing', courseName: null });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleNavigate = (page, courseName = null) => {
    setView({ page, courseName });
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    handleNavigate('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleNavigate('landing');
  };

  const renderPage = () => {
    switch (view.page) {
      case 'landing':
        return (
          <Landing
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        );
      case 'home':
        return (
          <Home
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        );
      case 'roadmap':
        return (
          <RoadmapPage
            courseName={view.courseName}
            onBack={() => handleNavigate('home')}
          />
        );
      case 'login':
        return (
          <Login
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
          />
        );
      case 'signup':
        return (
          <SignUp
            onNavigate={handleNavigate}
            onAuthSuccess={handleAuthSuccess}
          />
        );
      default:
        return (
          <Landing
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <>
      {renderPage()}
      <AnimatedRobot />
    </>
  );
}

export default App;

