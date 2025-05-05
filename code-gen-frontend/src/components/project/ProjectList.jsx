// src/components/project/ProjectList.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';

const ProjectList = () => {
  const { projects, loading, error } = useProject();

  if (loading) {
    return <div className="text-center py-4">Loading projects...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
        Error loading projects: {error}
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg text-center">
        <p className="text-lg text-gray-600">No projects yet. Create your first project!</p>
        <Link 
          to="/create-project" 
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Project
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link 
          key={project._id} 
          to={`/projects/${project._id}`}
          className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
          
          {project.techStack && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2">
                {project.techStack.frontend.map((tech, index) => (
                  <span key={`frontend-${index}`} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {tech}
                  </span>
                ))}
                {project.techStack.backend.map((tech, index) => (
                  <span key={`backend-${index}`} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {tech}
                  </span>
                ))}
                {project.techStack.database.map((tech, index) => (
                  <span key={`db-${index}`} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-blue-600 font-medium">View Details →</div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;