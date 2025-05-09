// src/pages/Dashboard.js (continued)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectAPI } from '../services/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectAPI.getAllProjects();
        setProjects(data);
      } catch {
        toast.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.deleteProject(id);
        setProjects(projects.filter((project) => project._id !== id));
        toast.success('Project deleted successfully');
      } catch {
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading projects...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <Link
          to="/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">You don't have any projects yet.</p>
          <Link
            to="/projects/new"
            className="text-blue-600 hover:underline"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4">
                    Status: 
                    <span className={`ml-1 font-medium ${
                      project.status === 'completed' ? 'text-green-600' : 
                      project.status === 'failed' ? 'text-red-600' : 
                      project.status === 'generating' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </span>
                  <span>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;