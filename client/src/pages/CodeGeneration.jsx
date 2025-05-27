import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Loader2, Check, Send, Download, Archive } from 'lucide-react';

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
  
  // New states for file selection
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [sendingForRefinement, setSendingForRefinement] = useState(false);
  const [refinementSuccess, setRefinementSuccess] = useState(false);
  
  // NEW: Page navigation state
  const [currentPage, setCurrentPage] = useState('generation'); // 'generation' or 'refinement'

  const MAX_SELECTED_FILES = 5;

  // NEW: Client-side ZIP download functionality
  const handleDownloadZipClient = async () => {
    setDownloading(true);
    try {
      // Load JSZip dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      
      // Wait for JSZip to load
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // Create new ZIP instance
      const zip = new window.JSZip();

      // Add each file to the zip with proper folder structure
      if (fileData) {
        fileData.forEach(file => {
          zip.file(file.file_path, file.code);
        });
      }

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });

      // Create download link
      const url = window.URL.createObjectURL(content);
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

  // Your existing backend ZIP download (keeping as is)
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

  const handleFileSelection = (file, isSelected) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      
      if (isSelected && newSet.size < MAX_SELECTED_FILES) {
        newSet.add(file.file_path);
      } else if (!isSelected) {
        newSet.delete(file.file_path);
      }
      
      return newSet;
    });
  };

  // MODIFIED: Added navigation to refinement page after successful send
  const handleSendForRefinement = async () => {
  if (selectedFiles.size === 0) {
    setError('Please select at least one file for refinement');
    return;
  }

  setSendingForRefinement(true);
  setError(null);
  setRefinementSuccess(false);

  try {
    // Get the selected files data
    const selectedFilesData = fileData.filter(file => 
      selectedFiles.has(file.file_path)
    );

    const response = await fetch('http://localhost:5000/api/code-generation/send-for-refinement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selected_files: selectedFilesData
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const result = await response.json();
    setRefinementSuccess(true);
    
    // Clear selections after successful send
    setSelectedFiles(new Set());
    
    // NEW: Call combine-json API and navigate to refinement page
    try {
      const combineResponse = await fetch('http://localhost:5000/api/code-refinement/combine-json', {
        method: 'GET'
      });
      
      if (!combineResponse.ok) {
        console.warn('Combine JSON API failed, but proceeding to refinement page');
      }
      
      // Navigate to refinement page
      setTimeout(() => {
        window.location.href = '/code-refinement';;
        setRefinementSuccess(false);
      }, 1500);
      
    } catch (combineError) {
      console.error('Error calling combine-json:', combineError);
      // Still navigate even if combine fails
      setTimeout(() => {
        window.location.href = '/code-refinement';;
        setRefinementSuccess(false);
      }, 1500);
    }

  } catch (error) {
    console.error('Error sending files for refinement:', error);
    setError(`Error sending files for refinement: ${error.message}`);
  } finally {
    setSendingForRefinement(false);
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

  // MODIFIED: Added condition to show/hide checkboxes based on current page
  const FileTreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile && node.data && selectedFile.file_path === node.data.file_path;
    const isFileSelected = node.data && selectedFiles.has(node.data.file_path);

    const handleClick = () => {
      if (node.type === 'file') {
        setSelectedFile(node.data);
      } else {
        toggleFolder(node.path);
      }
    };

    const handleCheckboxChange = (e) => {
      e.stopPropagation();
      if (node.data) {
        handleFileSelection(node.data, !isFileSelected);
      }
    };

    return (
      <div className={`ml-${level * 4}`}>
        <div
          className={`flex items-center p-2 cursor-pointer rounded transition-colors
                    ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'}
                    ${isFileSelected ? 'bg-green-50 border-l-2 border-green-400' : ''}`}
          onClick={handleClick}
          style={{
            marginLeft: `${level * 12}px`,
            transition: 'background-color 0.2s ease'
          }}
        >
          {node.type === 'file' && currentPage === 'generation' && (
            <input
              type="checkbox"
              checked={isFileSelected}
              onChange={handleCheckboxChange}
              disabled={!isFileSelected && selectedFiles.size >= MAX_SELECTED_FILES}
              className="mr-2 h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
            />
          )}
          
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
              <span className={currentPage === 'generation' ? "ml-6" : ""}></span>
              <File size={16} className={`mr-2 ${isFileSelected ? 'text-green-500' : 'text-blue-500'}`} />
              <span className={`text-gray-800 truncate ${isFileSelected ? 'font-medium' : ''}`}>
                {node.name}
              </span>
              {isFileSelected && currentPage === 'generation' && (
                <Check size={14} className="text-green-500 ml-auto" />
              )}
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

  // NEW: Code Refinement Page Component
  const CodeRefinementPage = () => (
    <div className="p-6 max-w-screen-xl mx-auto" style={{ backgroundColor: colors.background }}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ borderColor: colors.borderDefault }}>
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: colors.borderDefault }}>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Code Refinement</h1>
            <p className="text-gray-600 mt-1">Review and download your refined project files</p>
          </div>
          <button
            onClick={() => setCurrentPage('generation')}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            ← Back to Generation
          </button>
        </div>

        <div className="p-6 border-b bg-gradient-to-r from-green-50 to-blue-50" style={{ borderColor: colors.borderDefault }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <Check className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Files Successfully Sent for Refinement</h3>
                <p className="text-gray-600">Your selected files have been processed and are ready for download</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDownloadZip}
                disabled={downloading}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center shadow-md hover:shadow-lg
                          ${downloading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
                          text-white`}
              >
                {downloading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Archive className="mr-2" size={18} />
                    Download ZIP
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownloadZipClient}
                disabled={downloading}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center border
                          ${downloading ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-blue-500 text-blue-600 hover:bg-blue-50'}
                          bg-white`}
              >
                {downloading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2" size={16} />
                    Quick Download
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="m-4 p-4 rounded-lg animate-fadeIn flex items-start bg-red-50 border border-red-200">
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
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Refined Project Files</h2>
              <div className="text-xs text-gray-500 mb-3">
                {fileData?.length || 0} files in the project
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 100px)' }}>
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

  // NEW: Conditional rendering based on current page
  if (currentPage === 'refinement') {
    return <CodeRefinementPage />;
  }

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

        {refinementSuccess && (
          <div className="m-4 p-4 rounded-lg animate-fadeIn flex items-start bg-green-50 border border-green-200">
            <div className="text-green-500 mr-3 mt-0.5">
              <Check size={20} />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Success</h3>
              <p className="text-green-700">Files sent for refinement successfully! Redirecting...</p>
            </div>
          </div>
        )}

        {fileTree && (
          <>
            {/* File Selection Controls */}
            <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Selected: <span className="font-medium text-gray-800">{selectedFiles.size}</span> / {MAX_SELECTED_FILES} files
                </div>
                {selectedFiles.size > 0 && (
                  <button
                    onClick={() => setSelectedFiles(new Set())}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadZipClient}
                  disabled={downloading}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center
                            ${downloading
                              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                              : 'bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg'
                            }`}
                >
                  {downloading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2" size={16} />
                      Download ZIP
                    </>
                  )}
                </button>

                <button
                  onClick={handleSendForRefinement}
                  disabled={selectedFiles.size === 0 || sendingForRefinement}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center
                            ${selectedFiles.size === 0 || sendingForRefinement
                              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                              : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                            }`}
                >
                  {sendingForRefinement ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={16} />
                      Send for Refinement
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4">
              <div
                className="border-r p-4 overflow-auto max-h-[70vh] lg:col-span-1"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDefault }}
              >
                <h2 className="text-lg font-semibold mb-3 text-gray-800">Project Files</h2>
                <div className="text-xs text-gray-500 mb-3">
                  Check files to select for refinement (max {MAX_SELECTED_FILES})
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 100px)' }}>
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
          </>
        )}
      </div>
    </div>
  );
};

export default CodeGeneration;