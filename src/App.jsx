import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Landing from './pages/Landing';
import RoadmapPage from './pages/RoadmapPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AnimatedRobot from './components/AnimatedRobot';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });

  const [view, setView] = useState(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    return { page: auth ? 'home' : 'landing', courseName: null };
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/v1/auth/verify', { credentials: 'include' })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Session verify failed');
        })
        .then(data => {
          if (data.name) {
            setUserName(data.name);
            localStorage.setItem('userName', data.name);
          }
        })
        .catch(err => {
          console.error('Session verification error:', err);
          // Session invalid — force logout
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userName');
          setIsAuthenticated(false);
          setUserName('');
          setView({ page: 'landing', courseName: null });
        });
    } else {
      setUserName('');
      localStorage.removeItem('userName');
    }
  }, [isAuthenticated]);

  const handleNavigate = (page, courseName = null) => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (!auth && page !== 'login' && page !== 'signup' && page !== 'landing') {
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

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
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
            userName={userName}
          />
        );
      case 'roadmap':
        return (
          <RoadmapPage
            courseName={view.courseName}
            onBack={() => handleNavigate('home')}
            isAuthenticated={isAuthenticated}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        );
      case 'login':
        return (
          <Login
            onNavigate={handleNavigate}
            onAuthSuccess={handleLoginSuccess}
          />
        );
      case 'signup':
        return (
          <SignUp
            onNavigate={handleNavigate}
            onAuthSuccess={handleLoginSuccess}
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
