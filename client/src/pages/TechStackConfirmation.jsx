import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FolderIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TreeNode = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first two levels

  const hasChildren = node.children && node.children.length > 0;
  const isFile = node.type === 'file';

  return (
    <div className={`ml-${level * 4}`}>
      <div 
        className="flex items-center py-1 hover:bg-gray-100 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span className="w-4 mr-1">
            {isExpanded ? '▼' : '►'}
          </span>
        )}
        {!hasChildren && !isFile && <span className="w-4 mr-1"></span>}
        {isFile ? <FileIcon /> : <FolderIcon />}
        <span className="ml-1 font-mono text-sm">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const buildFileTree = (files) => {
  const tree = { name: 'root', children: [] };

  files.forEach(filePath => {
    const parts = filePath.split('/');
    let currentLevel = tree.children;

    parts.forEach((part, index) => {
      const existingNode = currentLevel.find(node => node.name === part);
      
      if (!existingNode) {
        const newNode = {
          name: part,
          type: index === parts.length - 1 ? 'file' : 'folder',
          children: []
        };
        currentLevel.push(newNode);
        currentLevel = newNode.children;
      } else {
        currentLevel = existingNode.children;
      }
    });
  });

  return tree;
};

const buildFolderTree = (folders) => {
  const lines = folders.split('\n').filter(line => line.trim());
  const root = { name: 'root', children: [] };
  const stack = [{ level: -1, node: root }];

  lines.forEach(line => {
    const level = line.match(/^\s*/)[0].length / 2;
    const name = line.trim().replace(/\/$/, ''); // Remove trailing slashes

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].node;
    const newNode = { name, children: [] };
    parent.children.push(newNode);
    stack.push({ level, node: newNode });
  });

  return root;
};

function TechStackConfirmation() {
  const navigate = useNavigate();
  const [scaffoldingData, setScaffoldingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateScaffolding = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/generate-scaffolding');
      if (response.data?.data?.json) {
        setScaffoldingData(response.data.data.json);
      } else {
        throw new Error('Invalid scaffolding data received');
      }
    } catch (error) {
      console.error('Error generating scaffolding:', error);
      setError(error.message || 'Failed to generate project scaffolding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProjectStructure = () => {
    if (!scaffoldingData) return null;

    const fileTree = buildFileTree(scaffoldingData.files.split('\n').filter(Boolean));
    const folderTree = buildFolderTree(scaffoldingData.folders);

    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">{scaffoldingData.project_name}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="font-medium mb-3">Folder Structure</h4>
            <div className="max-h-96 overflow-y-auto">
              <TreeNode node={folderTree} />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h4 className="font-medium mb-3">File Structure</h4>
            <div className="max-h-96 overflow-y-auto">
              <TreeNode node={fileTree} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Project Confirmation</h1>
          <p className="mt-3 text-xl text-gray-600">Review your project structure</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <button
            onClick={handleGenerateScaffolding}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Project Structure'}
          </button>

          {renderProjectStructure()}
        </div>
      </div>
    </div>
  );
}

export default TechStackConfirmation;