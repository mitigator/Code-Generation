// src/components/project/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../../services/projectService';
import Button from '../common/Button';
import TechStackForm from '../techStack/TechStackForm';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProject(id);
        setProject(data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading project details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
        Error: {error}
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const hasTechStack = project.techStack && (
    project.techStack.frontend?.length || 
    project.techStack.backend?.length || 
    project.techStack.database?.length
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
        <p className="text-gray-700 mb-6">{project.description}</p>
        
        {hasTechStack ? (
          <>
            <h2 className="text-xl font-semibold mb-3">Tech Stack</h2>
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {project.techStack.frontend?.map((tech, index) => (
                  <span key={`frontend-${index}`} className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                    {tech}
                  </span>
                ))}
                {project.techStack.backend?.map((tech, index) => (
                  <span key={`backend-${index}`} className="px-3 py-1 bg-green-100 text-green-800 rounded">
                    {tech}
                  </span>
                ))}
                {project.techStack.database?.map((tech, index) => (
                  <span key={`db-${index}`} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              {project.generatedFiles?.length > 0 ? (
                <Link to={`/projects/${project._id}/code`}>
                  <Button type="primary">View Generated Code</Button>
                </Link>
              ) : (
                <div className="bg-yellow-100 p-4 rounded">
                  <p className="text-yellow-800">
                    Code generation in progress. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Select Tech Stack</h2>
            <TechStackForm projectId={project._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;