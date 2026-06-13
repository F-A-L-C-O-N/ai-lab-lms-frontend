import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Landing from './pages/Landing';
import RoadmapPage from './pages/RoadmapPage';
import TopicDetailPage from './pages/TopicDetailPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AnimatedRobot from './components/AnimatedRobot';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManager from './pages/admin/CourseManager';
import TopicManager from './pages/admin/TopicManager';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });

  const [view, setView] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#admin') return { page: 'admin', courseName: null };
    if (hash === '#admin-course') return { page: 'admin-course', courseName: null };
    if (hash.startsWith('#admin-topic/')) {
      const decodedCourse = decodeURIComponent(hash.substring('#admin-topic/'.length));
      return { page: 'admin-topic', courseName: decodedCourse };
    }
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    return { page: auth ? 'home' : 'landing', courseName: null };
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setView({ page: 'admin', courseName: null });
      } else if (hash === '#admin-course') {
        setView({ page: 'admin-course', courseName: null });
      } else if (hash.startsWith('#admin-topic/')) {
        const decodedCourse = decodeURIComponent(hash.substring('#admin-topic/'.length));
        setView({ page: 'admin-topic', courseName: decodedCourse });
      } else if (hash === '') {
        const auth = localStorage.getItem('isAuthenticated') === 'true';
        setView(prev => {
          if (prev.page.startsWith('admin')) {
            return { page: auth ? 'home' : 'landing', courseName: null };
          }
          return prev;
        });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
            if (data.email) {
              localStorage.setItem('userEmail', data.email);
            }
          }
        })
        .catch(err => {
          console.error('Session verification error:', err);
          // Session invalid — force logout
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          setIsAuthenticated(false);
          setUserName('');
          setView({ page: 'landing', courseName: null });
        });
    } else {
      setUserName('');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
    }
  }, [isAuthenticated]);

  const handleNavigate = (page, courseName = null, topicId = null) => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    if (!auth && page !== 'login' && page !== 'signup' && page !== 'landing') {
      setView({ page: 'login', courseName: null, topicId: null });
    } else {
      if (page === 'admin') {
        window.location.hash = 'admin';
      } else if (page === 'admin-course') {
        window.location.hash = 'admin-course';
      } else if (page === 'admin-topic') {
        window.location.hash = `admin-topic/${encodeURIComponent(courseName)}`;
      } else {
        window.location.hash = '';
      }
      setView({ page, courseName, topicId });
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
    localStorage.removeItem('userEmail');
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
      case 'topic-detail':
        return (
          <TopicDetailPage
            courseName={view.courseName}
            topicId={view.topicId}
            onBack={() => handleNavigate('roadmap', view.courseName)}
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
      case 'admin':
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        );
      case 'admin-course':
        return (
          <CourseManager
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
        );
      case 'admin-topic':
        return (
          <TopicManager
            courseName={view.courseName}
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
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

  const showRobot = view.page !== 'landing' && view.page !== 'login' && view.page !== 'signup' && !view.page.startsWith('admin');

  return (
    <>
      {renderPage()}
      {showRobot && <AnimatedRobot />}
    </>
  );
}

export default App;
