import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/project-startup');
  };

  return (
    <div className="container mt-5">
      <div className="jumbotron center">
        <h1>Welcome to Flowise Integration</h1>
        <p className="mb-3">
          Generate and refine project descriptions using Flowise AI
        </p>
        <button 
          className="btn btn-primary" 
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;