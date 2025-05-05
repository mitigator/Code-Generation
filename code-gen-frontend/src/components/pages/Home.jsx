// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProjectList from '../components/project/ProjectList';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Assisted Code Generation</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Generate boilerplate or functional code based on high-level descriptions and your desired tech stack.
        </p>
        <div className="mt-6">
          <Link 
            to="/create-project" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Project
          </Link>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
        <ProjectList />
      </div>
    </div>
  );
};

export default Home;