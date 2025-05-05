// src/pages/CreateProject.jsx
import React from 'react';
import ProjectForm from '../components/project/ProjectForm';

const CreateProject = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Project</h1>
      <ProjectForm />
    </div>
  );
};

export default CreateProject;