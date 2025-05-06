import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DescriptionPage from './pages/DescriptionPage';
import EntityGenerationPage from './pages/EntityGenerationPage';
import EntityRefinementPage from './pages/EntityRefinementPage';


function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/description" element={<DescriptionPage />} />
          <Route path="/entity-generation" element={<EntityGenerationPage />} />
          <Route path="/entity-refinement" element={<EntityRefinementPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;