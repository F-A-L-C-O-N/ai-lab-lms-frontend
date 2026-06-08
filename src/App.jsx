import { useState } from 'react';
import Home from './pages/Home';
import RoadmapPage from './pages/RoadmapPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AnimatedRobot from './components/AnimatedRobot';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [view, setView] = useState(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    return { page: auth ? 'home' : 'login', courseName: null };
  });

  const handleNavigate = (page, courseName = null) => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (!auth && page !== 'login' && page !== 'signup') {
      setView({ page: 'login', courseName: null });
    } else {
      setView({ page, courseName });
    }
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    handleNavigate('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    handleNavigate('login');
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

