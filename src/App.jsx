import React, { useState } from 'react';
import Home from './pages/Home';
import RoadmapPage from './pages/RoadmapPage';

function App() {
  const [view, setView] = useState({ page: 'home', courseName: null });

  const handleNavigate = (page, courseName = null) => {
    setView({ page, courseName });
    window.scrollTo(0, 0);
  };

  if (view.page === 'roadmap') {
    return (
      <RoadmapPage 
        courseName={view.courseName} 
        onBack={() => handleNavigate('home')} 
      />
    );
  }

  return (
    <Home onNavigate={handleNavigate} />
  );
}

export default App;
