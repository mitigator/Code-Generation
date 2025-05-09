// src/pages/ProjectDetail.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectAPI } from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(null);

  const startPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    const interval = setInterval(async () => {
      try {
        const status = await projectAPI.getGenerationStatus(id);
        
        // Update logs
        setLogs(status.logs);
        
        // Check if generation is complete
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
          
          // Refresh project data
          const updatedProject = await projectAPI.getProjectById(id);
          setProject(updatedProject);
          setGenerating(false);
          
          if (status.status === 'completed') {
            toast.success('Code generation completed successfully');
          } else {
            toast.error('Code generation failed');
          }
        }
      } catch {
        console.error('Error polling generation status');
      }
    }, 3000);

    setPollingInterval(interval);
 
  }, [id, pollingInterval]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectAPI.getProjectById(id);
        setProject(data);
        
        if (data.status === 'generating') {
          startPolling();
        }
      } catch {
        toast.error('Failed to fetch project details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    const fetchLogs = async () => {
      try {
        const data = await projectAPI.getProjectLogs(id);
        setLogs(data);
      } catch {
        console.error('Failed to fetch logs');
      }
    };

    fetchProject();
    fetchLogs();

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [id, navigate, pollingInterval, startPolling]);

  const handleGenerateCode = async () => {
    setGenerating(true);
    
    try {
      await projectAPI.generateCode(id);
      toast.info('Code generation started');
      
      // Start polling for status updates
      startPolling();
    } catch {
      toast.error('Failed to start code generation');
      setGenerating(false);
    }
  };

  const downloadProject = () => {
    window.location.href = `/api/projects/${id}/download`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading project details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-6">
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
        
        <div className="flex space-x-4">
          <button
            onClick={handleGenerateCode}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:bg-blue-300"
            disabled={generating || project.status === 'generating'}
          >
            {generating || project.status === 'generating' ? 'Generating...' : 'Generate Code'}
          </button>
          
          {project.status === 'completed' && (
            <button
              onClick={downloadProject}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-700"
            >
              Download Project
            </button>
          )}
        </div>
      </div>
      
      {project.acceptedEntities && project.acceptedEntities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Project Entities</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-green-600 mb-2">Accepted Entities</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {project.acceptedEntities.map((entity, index) => (
                <div key={index} className="mb-3 pb-3 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                  <p className="font-medium">{entity.Entity_Name}</p>
                  <p className="text-sm text-gray-600">{entity.Entity_Description}</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Fields:</span>{' '}
                    {entity.Fields.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {project.rejectedEntities && project.rejectedEntities.length > 0 && (
            <div>
              <h3 className="font-medium text-red-600 mb-2">Rejected Entities</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                {project.rejectedEntities.map((entity, index) => (
                  <div key={index} className="mb-3 pb-3 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
                    <p className="font-medium">{entity.Entity_Name}</p>
                    <p className="text-sm text-gray-600">{entity.Entity_Description}</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Fields:</span>{' '}
                      {entity.Fields.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Generation Logs</h2>
        
        {logs.length === 0 ? (
          <p className="text-gray-600">No logs available</p>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-80">
            {logs.map((log, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <span className={`inline-block w-24 text-xs font-medium ${
                  log.level === 'info' ? 'text-blue-600' : 
                  log.level === 'warning' ? 'text-yellow-600' : 
                  log.level === 'error' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {new Date(log.timestamp).toLocaleTimeString()} [{log.level.toUpperCase()}]
                </span>
                <span className="text-sm">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;