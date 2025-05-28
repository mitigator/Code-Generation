import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './services/ThemeContext';
import './App.css'
import Home from './pages/Home';
import ProjectStartupPage from './components/ProjectStartup';
import EntityGenerationPage from './components/EntityGeneration';
import TechStackSelection from './pages/TechStackSelection';
import TechStackConfirmation from './pages/TechStackConfirmation';
import CodeGeneration from './pages/CodeGeneration';
import CodeRefinement from './pages/CodeRefinement';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project-startup" element={<ProjectStartupPage />} />
              <Route path="/entity-generation" element={<EntityGenerationPage />} />
              <Route path="/tech-stack-selection" element={<TechStackSelection />} />
              <Route path="/project-confirmation" element={<TechStackConfirmation />} />
              <Route path="/code-generation" element={<CodeGeneration />} />
              <Route path="/code-refinement" element={<CodeRefinement />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
