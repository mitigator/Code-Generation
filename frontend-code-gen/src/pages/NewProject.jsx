// frontend-code-gen/src/pages/NewProject.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { projectAPI, flowiseAPI } from '../services/api';

const NewProject = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [entities, setEntities] = useState({
    accepted: [],
    rejected: []
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      toast.error('Project name is required');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await flowiseAPI.generateDescription({
        projectName: formData.name
      });
      
      let description = '';
      if (typeof result.description === 'string') {
        description = result.description;
      } else if (result.description) {
        description = JSON.stringify(result.description);
      } else if (typeof result === 'string') {
        description = result;
      } else {
        description = JSON.stringify(result);
      }
      
      setFormData({
        ...formData,
        description: description
      });
      
      toast.success('Description generated successfully');
    } catch (error) {
      console.error('Description generation error:', error);
      toast.error('Failed to generate description');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEntities = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Project name and description are required');
      return;
    }
    
    setLoading(true);
    
    try {
      // Log what we're sending to the API
      console.log('Sending entity generation request:', {
        projectName: formData.name,
        projectDescription: formData.description
      });
      
      const result = await flowiseAPI.generateEntities({
        projectName: formData.name,
        projectDescription: formData.description
      });
      
      console.log('Entity generation result:', result);
      
      // Handle different response formats
      let acceptedEntities = [];
      let rejectedEntities = [];
      
      if (result.entities) {
        if (result.entities.accepted) {
          acceptedEntities = result.entities.accepted;
        } else if (Array.isArray(result.entities)) {
          acceptedEntities = result.entities;
        }
        
        if (result.entities.rejected) {
          rejectedEntities = result.entities.rejected;
        }
      } else if (result.project) {
        acceptedEntities = result.project.acceptedEntities || [];
        rejectedEntities = result.project.rejectedEntities || [];
      }
      
      setEntities({
        accepted: acceptedEntities,
        rejected: rejectedEntities
      });
      
      if (acceptedEntities.length === 0) {
        toast.warning('No entities were generated. Try adjusting your project description.');
      } else {
        toast.success(`Generated ${acceptedEntities.length} entities successfully`);
        setStep(2);
      }
    } catch (error) {
      console.error('Entity generation error:', error);
      toast.error('Failed to generate entities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    setLoading(true);
    
    try {
      const project = await projectAPI.createProject({
        name: formData.name,
        description: formData.description,
        acceptedEntities: entities.accepted,
        rejectedEntities: entities.rejected
      });
      
      toast.success('Project created successfully');
      navigate(`/projects/${project._id}`);
    } catch (error) {
      console.error('Project creation error:', error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      
      {step === 1 && (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700" htmlFor="description">
                Project Description
              </label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                className="text-blue-600 hover:underline text-sm"
                disabled={loading || !formData.name}
              >
                {loading ? 'Generating...' : 'Generate Description'}
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Enter project description or generate one"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGenerateEntities}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:bg-blue-300"
              disabled={loading || !formData.name || !formData.description}
            >
              {loading ? 'Processing...' : 'Generate Entities'}
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <p className="mb-2"><strong>Name:</strong> {formData.name}</p>
            <p className="mb-4"><strong>Description:</strong> {formData.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Generated Entities</h2>
            
            <h3 className="font-medium text-green-600 mb-2">Accepted Entities</h3>
            {entities.accepted.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                {entities.accepted.map((entity, index) => (
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
            ) : (
              <p className="text-gray-600 mb-4">No accepted entities</p>
            )}
            
            {entities.rejected.length > 0 && (
              <>
                <h3 className="font-medium text-red-600 mb-2">Rejected Entities</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {entities.rejected.map((entity, index) => (
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
              </>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-blue-600 hover:underline"
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleCreateProject}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProject;