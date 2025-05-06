import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function HomePage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/description');
  };

  return (
    <div className="card">
      <Header title="Entity Management System" />
      <p>Welcome to the Entity Management System. This application helps you generate and refine project entities based on your project description.</p>
      <button onClick={handleStart}>Start</button>
    </div>
  );
}

export default HomePage;