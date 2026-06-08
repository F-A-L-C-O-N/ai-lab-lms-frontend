import { useState } from 'react';
import Home from './pages/Home';
import RoadmapPage from './pages/RoadmapPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [view, setView] = useState(() => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    return { page: auth ? 'home' : 'landing', courseName: null };
  });

  const handleNavigate = (page, courseName = null) => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (!auth && page !== 'login' && page !== 'signup' && page !== 'landing') {
      setView({ page: 'landing', courseName: null });
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
    handleNavigate('landing');
  };

  if (view.page === 'roadmap') {
    return (
      <RoadmapPage 
        courseName={view.courseName} 
        onBack={() => handleNavigate('home')} 
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    );
  }

  if (view.page === 'landing') {
    return (
      <Landing 
        onNavigate={handleNavigate} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    );
  }

  if (view.page === 'login') {
    return (
      <Login onNavigate={handleNavigate} onAuthSuccess={handleLoginSuccess} />
    );
  }

  if (view.page === 'signup') {
    return (
      <SignUp onNavigate={handleNavigate} onAuthSuccess={handleLoginSuccess} />
    );
  }

  return (
    <Home 
      onNavigate={handleNavigate} 
      isAuthenticated={isAuthenticated}
      onLogout={handleLogout}
    />
  );
}

export default App;
