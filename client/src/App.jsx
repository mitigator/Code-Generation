import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import ProjectStartupPage from './components/ProjectStartup';
import EntityGenerationPage from './components/EntityGeneration';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project-startup" element={<ProjectStartupPage />} />
          <Route path="/entity-generation" element={<EntityGenerationPage />} />
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
