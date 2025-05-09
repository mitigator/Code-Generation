// frontend-code-gen/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages - Make sure all these files exist and export components correctly
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NewProject from './pages/NewProject';
import ProjectDetail from './pages/ProjectDetail';

// Components
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

// Check if all components are properly defined before using them
console.log({
  Dashboard,
  Login,
  Register,
  NewProject,
  ProjectDetail,
  Header,
  PrivateRoute
});

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects/new" element={<PrivateRoute><NewProject /></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;