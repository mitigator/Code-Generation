// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './context/ProjectContext';
import Header from './components/layout/Header';
import Home from './pages/Home';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import GeneratedCode from './pages/GeneratedCode';

function App() {
  return (
    <Router>
      <ProjectProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-project" element={<CreateProject />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/projects/:id/code" element={<GeneratedCode />} />
            </Routes>
          </main>
        </div>
      </ProjectProvider>
    </Router>
  );
}

export default App;