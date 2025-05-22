import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Loader2 } from 'lucide-react';

const CodeGeneration = () => {
  // Color Scheme
  const colors = {
    primary: "#3B82F6",
    primaryDark: "#1D4ED8",
    primaryLight: "#93C5FD",
    secondary: "#10B981",
    secondaryDark: "#059669",
    secondaryLight: "#6EE7B7",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    darkSurface: "#1F2937",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textLight: "#9CA3AF",
    textOnDark: "#F3F4F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    borderDefault: "#E5E7EB",
    borderFocus: "#93C5FD",
    borderDark: "#374151"
  };

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTree, setFileTree] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [downloading, setDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const response = await fetch('http://localhost:5000/api/code-generation/download-zip', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to download project');
      }

      // Get the blob data
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project.zip';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success message
      alert('Project downloaded successfully!');

    } catch (error) {
      console.error('Error downloading zip:', error);
      setError(`Error downloading project: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    checkForExistingData();
  }, []);

  const checkForExistingData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/code-generation/check');
      const data = await response.json();

      if (data.exists) {
        await loadExistingData();
      }
    } catch (error) {
      console.error('Error checking for existing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/code-generation/get-data');
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      processFileData(data);
    } catch (error) {
      setError(`Error loading data: ${error.message}`);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/code-generation/generate', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      processFileData(data.result);
    } catch (error) {
      console.error('Error generating code:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const processFileData = (data) => {
    try {
      let files;

      if (data.text) {
        const jsonMatch = data.text.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          const parsed = JSON.parse(jsonMatch[1]);
          files = parsed.project_files;
        }
      } else if (data.project_files) {
        files = data.project_files;
      }

      if (!files) {
        throw new Error("Couldn't extract project files from the data");
      }

      setFileData(files);

      const tree = buildFileTree(files);
      setFileTree(tree);

      // Initialize expanded folders with root paths
      const initialExpanded = new Set();
      Object.keys(tree.children).forEach(key => {
        initialExpanded.add(key);
      });
      setExpandedFolders(initialExpanded);

      if (files.length > 0) {
        setSelectedFile(files[0]);
      }
    } catch (error) {
      setError(`Error processing file data: ${error.message}`);
    }
  };

  const buildFileTree = (files) => {
    const root = { name: 'root', children: {}, type: 'folder', path: '' };

    files.forEach(file => {
      const pathParts = file.file_path.split('/');
      let currentLevel = root;
      let currentPath = '';

      pathParts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!currentLevel.children[part]) {
          currentLevel.children[part] = {
            name: part,
            children: {},
            type: index === pathParts.length - 1 ? 'file' : 'folder',
            data: index === pathParts.length - 1 ? file : null,
            path: currentPath
          };
        }
        currentLevel = currentLevel.children[part];
      });
    });

    return root;
  };

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  };

  const FileTreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile && node.data && selectedFile.file_path === node.data.file_path;

    const handleClick = () => {
      if (node.type === 'file') {
        setSelectedFile(node.data);
      } else {
        toggleFolder(node.path);
      }
    };

    return (
      <div className={`ml-${level * 4}`}>
        <div
          className={`flex items-center p-2 cursor-pointer rounded transition-colors
                    ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
          onClick={handleClick}
          style={{
            marginLeft: `${level * 12}px`,
            transition: 'background-color 0.2s ease'
          }}
        >
          {node.type === 'folder' ? (
            <>
              <span className="mr-1">
                {isExpanded ? (
                  <ChevronDown size={16} className="text-gray-600" />
                ) : (
                  <ChevronRight size={16} className="text-gray-600" />
                )}
              </span>
              <Folder size={16} className="text-yellow-500 mr-2" />
              <span className="text-gray-800">{node.name}</span>
            </>
          ) : (
            <>
              <span className="ml-6"></span>
              <File size={16} className="text-blue-500 mr-2" />
              <span className="text-gray-800 truncate">{node.name}</span>
            </>
          )}
        </div>

        {node.type === 'folder' && isExpanded && (
          <div className="transition-all duration-300 ease-in-out">
            {Object.values(node.children)
              .sort((a, b) => {
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                return a.name.localeCompare(b.name);
              })
              .map((childNode) => (
                <FileTreeNode
                  key={childNode.path}
                  node={childNode}
                  level={level + 1}
                />
              ))}
          </div>
        )}
      </div>
    );
  };

  const FileContent = ({ file }) => {
    if (!file) return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a file to view its content</p>
      </div>
    );

    return (
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 truncate">{file.file_path}</h3>
          {file.description && (
            <span className="text-sm text-gray-600 mt-1 sm:mt-0">{file.description}</span>
          )}
        </div>
        <div className="relative">
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto max-h-[65vh] animate-fadeIn">
            <code>{file.code}</code>
          </pre>
          <div className="absolute top-2 right-2 bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded">
            {file.file_path.split('.').pop()}
          </div>
        </div>
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="animate-spin text-blue-500" size={32} />
      <p className="mt-3 text-gray-600">Generating code...</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 max-w-md">
        <div
          className="bg-blue-500 h-2.5 rounded-full animate-pulse"
          style={{ width: '70%' }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-screen-xl mx-auto" style={{ backgroundColor: colors.background }}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderColor: colors.borderDefault }}>
        <div className="p-6 border-b" style={{ borderColor: colors.borderDefault }}>
          <h1 className="text-2xl font-bold text-gray-800">Code Generation</h1>
          <p className="text-gray-600 mt-1">Generate and explore project files</p>
        </div>

        {!fileData && !loading && (
          <div className="p-6 flex flex-col items-center">
            <div className="max-w-md text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Generate Project Code</h2>
              <p className="text-gray-600">
                This will send the project specifications to the AI and generate all the necessary code files.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300
                        ${generating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                        text-white shadow-md hover:shadow-lg flex items-center`}
              style={{ backgroundColor: generating ? colors.primaryLight : colors.primary }}
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Generating...
                </>
              ) : 'Generate Code'}
            </button>
          </div>
        )}

        

        {loading && (
          <div className="p-8 flex justify-center">
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p className="mt-3 text-gray-600">Loading project data...</p>
            </div>
          </div>
        )}

        {generating && <LoadingSpinner />}

        {error && (
          <div
            className="m-4 p-4 rounded-lg animate-fadeIn flex items-start"
            style={{ backgroundColor: colors.error + '10', borderColor: colors.error }}
          >
            <div className="text-red-500 mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {fileTree && (
          <div className="grid grid-cols-1 lg:grid-cols-4">
            <div
              className="border-r p-4 overflow-auto max-h-[70vh] lg:col-span-1"
              style={{ backgroundColor: colors.surface, borderColor: colors.borderDefault }}
            >
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Project Files</h2>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 50px)' }}>
                {Object.values(fileTree.children).map(childNode => (
                  <FileTreeNode key={childNode.path} node={childNode} />
                ))}
              </div>
            </div>

            <div
              className="p-4 lg:col-span-3"
              style={{ backgroundColor: colors.surface }}
            >
              <h2 className="text-lg font-semibold mb-3 text-gray-800">File Content</h2>
              <FileContent file={selectedFile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeGeneration;