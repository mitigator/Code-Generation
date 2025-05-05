// src/pages/GeneratedCode.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { getProject } from '../services/projectService';
import Button from '../components/common/Button';

const GeneratedCode = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProject(id);
        setProject(data);
        
        if (data.generatedFiles && data.generatedFiles.length > 0) {
          setSelectedFile(data.generatedFiles[0]);
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading generated code...</div>;
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

  if (!project.generatedFiles || project.generatedFiles.length === 0) {
    return (
      <div className="bg-yellow-100 p-4 rounded">
        <p className="text-yellow-800">
          No code has been generated for this project yet.
        </p>
      </div>
    );
  }

  // Determine language for syntax highlighting
  const getLanguage = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    const extensionMap = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      html: 'html',
      css: 'css',
      json: 'json',
      py: 'python',
      java: 'java',
      rb: 'ruby'
    };
    
    return extensionMap[extension] || 'javascript';
  };

  // Handle the download functionality
  const handleDownload = () => {
    window.open(`${import.meta.env.VITE_REACT_APP_API_URL}/projects/${id}/download`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Generated Code: {project.name}
        </h1>
        <Button onClick={handleDownload} type="success">
          Download All Files
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            <div className="max-h-[70vh] overflow-y-auto">
              <ul className="space-y-1">
                {project.generatedFiles.map((file, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 rounded text-sm ${selectedFile === file ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
                    >
                      {file.path}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="md:w-3/4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            {selectedFile ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{selectedFile.path}</h3>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <SyntaxHighlighter 
                    language={getLanguage(selectedFile.path)} 
                    style={docco}
                    showLineNumbers
                    wrapLines
                    className="text-sm"
                    customStyle={{ padding: '16px' }}
                  >
                    {selectedFile.content}
                  </SyntaxHighlighter>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Select a file to view its content</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedCode;
