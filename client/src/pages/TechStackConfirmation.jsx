import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// File type icons with color coding
const FileIcon = ({ fileName }) => {
  // Determine file type based on extension
  const getFileType = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    
    const iconMap = {
      js: (
        <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
        </svg>
      ),
      java: (
        <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
        </svg>
      ),
      jsx: (
        <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
        </svg>
      ),
      tsx: (
        <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
        </svg>
      ),
      json: (
        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3.5 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
      ),
      env: (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.001 14H4z" />
          <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z" />
        </svg>
      ),
      md: (
        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.345 6H5.5a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-6.879A1.5 1.5 0 0 0 19.56 8.5H16.5a1.5 1.5 0 0 1-1.5-1.5V4.06A1.5 1.5 0 0 0 13.94 3h-.094zM14.5 6.75V4.06a.06.06 0 0 1 .06-.06h.094a.06.06 0 0 1 .042.017l2.329 2.329a.06.06 0 0 1 .017.042v.062a.06.06 0 0 1-.06.06H15a.5.5 0 0 1-.5-.5z" />
          <path d="M6.75 12.75v-4.5h1.442l1.442 1.5 1.442-1.5h1.424v4.5h-1.424v-3l-1.442 1.5-1.442-1.5v3H6.75zm7.5-4.5h1.5v3h1.5v1.5h-3v-4.5z" />
        </svg>
      ),
      yml: (
        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
        </svg>
      )
    };

    return iconMap[ext] || (
      <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return getFileType(fileName);
};

const FolderIcon = ({ isOpen }) => (
  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    {isOpen ? (
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    ) : (
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    )}
  </svg>
);

// File/Folder Item Component with tree structure
const FileItem = ({ 
  item, 
  index, 
  totalItems, 
  generationProgress, 
  onSelect, 
  selectedItem,
  onToggleFolder,
  isOpen,
  depth = 0 
}) => {
  const isSelected = selectedItem && selectedItem.path === item.path;
  const isGenerating = generationProgress < 100;
  const shouldShow = (index / totalItems) * 100 <= generationProgress;
  const isFile = item.type === 'file';
  const hasChildren = item.children && item.children.length > 0;
  const indentSize = depth * 16;

  // Animation timing based on index
  const animationDelay = index * 50;
  
  // Colors
  const colors = {
    primary: "#3B82F6",
    success: "#10B981",
    border: "#E5E7EB",
    bgHover: "#F9FAFB"
  };

  return (
    <div 
      className={`transition-all duration-300 ease-in-out overflow-hidden ${shouldShow ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'}`}
      style={{ 
        marginLeft: `${indentSize}px`,
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <div 
        className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : 'hover:bg-gray-50 border-l-2 border-transparent'
        }`}
        onClick={() => {
          if (isFile) {
            onSelect(item);
          } else {
            onToggleFolder(item.path);
          }
        }}
      >
        <div className="mr-2 flex-shrink-0">
          {isFile ? (
            <FileIcon fileName={item.name} />
          ) : (
            <div className="flex items-center">
              <FolderIcon isOpen={isOpen} />
              {hasChildren && (
                <svg 
                  className={`w-4 h-4 ml-1 transform transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>
        <span className="font-mono text-sm truncate">{item.name}</span>
        
        {/* Show spinning loader for items being generated */}
        {isGenerating && index === Math.floor((generationProgress / 100) * totalItems) && (
          <svg className="ml-auto animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </div>

      {/* Render children if folder is open */}
      {!isFile && isOpen && hasChildren && (
        <div className="ml-4">
          {item.children.map((child, childIndex) => (
            <FileItem
              key={`${child.path}-${childIndex}`}
              item={child}
              index={childIndex}
              totalItems={item.children.length}
              generationProgress={generationProgress}
              onSelect={onSelect}
              selectedItem={selectedItem}
              onToggleFolder={onToggleFolder}
              isOpen={isOpen}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Project generation status component
const GenerationStatus = ({ progress, filesGenerated, totalFiles }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-700">
          Generating project files...
        </div>
        <div className="text-sm font-medium text-blue-600">
          {filesGenerated} / {totalFiles} files
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// Format file structure into a proper tree
const buildFileTree = (folders, files) => {
  const root = { name: 'root', path: '', type: 'folder', children: [] };
  const pathMap = { '': root };

  // Process folders first
  if (folders) {
    const folderLines = folders.split('\n').filter(line => line.trim());
    folderLines.forEach(folderPath => {
      const trimmedPath = folderPath.trim().replace(/\,$/, '');
      const parts = trimmedPath.split('/').filter(Boolean);
      
      let currentPath = '';
      let parent = root;
      
      parts.forEach((part, index) => {
        const path = `${currentPath}/${part}`.replace(/^\/+/, '');
        
        if (!pathMap[path]) {
          const node = {
            name: part,
            path: path,
            type: 'folder',
            children: []
          };
          
          pathMap[path] = node;
          parent.children.push(node);
        }
        
        parent = pathMap[path];
        currentPath = path;
      });
    });
  }

  // Then process files
  if (files) {
    const fileLines = files.split('\n').filter(line => line.trim());
    fileLines.forEach(filePath => {
      const trimmedPath = filePath.trim();
      const parts = trimmedPath.split('/').filter(Boolean);
      const fileName = parts.pop();
      
      let currentPath = '';
      let parent = root;
      
      // Find the parent folder
      parts.forEach(part => {
        const path = `${currentPath}/${part}`.replace(/^\/+/, '');
        if (!pathMap[path]) {
          // Create missing folders
          const node = {
            name: part,
            path: path,
            type: 'folder',
            children: []
          };
          pathMap[path] = node;
          parent.children.push(node);
        }
        parent = pathMap[path];
        currentPath = path;
      });
      
      // Add the file
      const fileNode = {
        name: fileName,
        path: `${currentPath}/${fileName}`.replace(/^\/+/, ''),
        type: 'file'
      };
      
      parent.children.push(fileNode);
    });
  }

  // Sort children alphabetically, folders first
  const sortChildren = (node) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      
      node.children.forEach(sortChildren);
    }
  };
  
  sortChildren(root);
  
  return root.children; // Return the top-level items (not the root itself)
};

function TechStackConfirmation() {
  const navigate = useNavigate();
  const [scaffoldingData, setScaffoldingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileStructure, setFileStructure] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [filesGenerated, setFilesGenerated] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFolders, setOpenFolders] = useState(new Set());
  const progressIntervalRef = useRef(null);

  // Colors for consistent styling
  const colors = {
    primary: "#3B82F6",
    primaryDark: "#2563EB",
    secondary: "#10B981",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textLight: "#9CA3AF",
    error: "#EF4444",
    borderDefault: "#E5E7EB"
  };

  // Toggle folder open/closed state
  const toggleFolder = (path) => {
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // Start generation progress animation
  const simulateGeneration = (totalFilesCount) => {
    setGenerationProgress(0);
    setFilesGenerated(0);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Create new interval to simulate file generation
    progressIntervalRef.current = setInterval(() => {
      setGenerationProgress(prev => {
        const increment = Math.random() * 5 + 1; // Random increment between 1-6
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current);
          return 100;
        }
        
        // Update files generated based on progress
        const filesGenerated = Math.floor((newProgress / 100) * totalFilesCount);
        setFilesGenerated(filesGenerated);
        
        return newProgress;
      });
    }, 150);
  };

  const handleGenerateScaffolding = async () => {
    setLoading(true);
    setError('');
    setSelectedItem(null);
    setOpenFolders(new Set()); // Reset open folders

    try {
      const response = await axios.post('http://localhost:5000/api/generate-scaffolding');
      
      if (response.data?.data?.json) {
        const data = response.data.data.json;
        setScaffoldingData(data);
        
        // Build the file tree structure
        const structure = buildFileTree(data.folders, data.files);
        setFileStructure(structure);
        
        // Count all files in the tree
        const countFiles = (nodes) => {
          return nodes.reduce((count, node) => {
            if (node.type === 'file') return count + 1;
            if (node.children) return count + countFiles(node.children);
            return count;
          }, 0);
        };
        
        const totalFilesCount = countFiles(structure);
        setTotalFiles(totalFilesCount);
        
        // Simulate generation
        simulateGeneration(totalFilesCount);
        
        // Open all folders by default
        const allFolderPaths = [];
        const collectFolderPaths = (nodes) => {
          nodes.forEach(node => {
            if (node.type === 'folder') {
              allFolderPaths.push(node.path);
              if (node.children) {
                collectFolderPaths(node.children);
              }
            }
          });
        };
        collectFolderPaths(structure);
        setOpenFolders(new Set(allFolderPaths));
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

  // Handle item selection
  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.background} 100%)`,
        color: colors.textPrimary 
      }}
    >
      {/* Progress tracker */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.secondary }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Project Setup</span>
            </div>
          </div>
          <div 
            className="flex-grow h-0.5 mx-4"
            style={{ backgroundColor: colors.secondary }}
          ></div>
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.secondary }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Entity Generation</span>
            </div>
          </div>
          <div 
            className="flex-grow h-0.5 mx-4"
            style={{ backgroundColor: colors.secondary }}
          ></div>
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.secondary }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Tech Stack</span>
            </div>
          </div>
          <div 
            className="flex-grow h-0.5 mx-4"
            style={{ backgroundColor: colors.primary }}
          ></div>
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              4
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Project Generation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: colors.textPrimary }}
          >
            Project Generation
          </h1>
          <p 
            className="mt-3 text-xl"
            style={{ color: colors.textSecondary }}
          >
            Review your project structure
          </p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 rounded-lg border flex items-start animate-bounce-once"
            style={{ 
              backgroundColor: `${colors.error}10`, 
              borderColor: `${colors.error}30` 
            }}
          >
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5" 
                style={{ color: colors.error }}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm" style={{ color: colors.error }}>{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="ml-auto"
              style={{ color: colors.error }}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div 
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          style={{ 
            backgroundColor: colors.surface,
            boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
          }}
        >
          {/* Header with button */}
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: colors.borderDefault }}>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                {scaffoldingData ? scaffoldingData.project_name : 'Project Structure'}
              </h2>
              {scaffoldingData && (
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {fileStructure.filter(i => i.type === 'folder').length} folders, {totalFiles} files
                </p>
              )}
            </div>
            <button
              onClick={handleGenerateScaffolding}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
              style={{ 
                color: 'white',
                backgroundColor: colors.primary,
                borderColor: 'transparent'
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : scaffoldingData ? (
                <>
                  <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Regenerate Project
                </>
              ) : (
                <>
                  <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Generate Project Structure
                </>
              )}
            </button>
          </div>

          {/* Show progress indicator during generation */}
          {generationProgress > 0 && generationProgress < 100 && (
            <div className="px-6 py-4 bg-blue-50">
              <GenerationStatus 
                progress={generationProgress} 
                filesGenerated={filesGenerated} 
                totalFiles={totalFiles} 
              />
            </div>
          )}

          {scaffoldingData ? (
            <div className="p-6">
              {/* Search input */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-10 rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ borderColor: colors.borderDefault }}
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* File structure container */}
              <div 
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: colors.borderDefault }}
              >
                <div className="p-4 bg-gray-50 border-b" style={{ borderColor: colors.borderDefault }}>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="font-medium">Project Structure</span>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto p-2">
                  {fileStructure.length > 0 ? (
                    fileStructure.map((item, index) => (
                      <FileItem 
                        key={`${item.path}-${index}`}
                        item={item}
                        index={index}
                        totalItems={fileStructure.length}
                        generationProgress={generationProgress}
                        onSelect={handleSelectItem}
                        selectedItem={selectedItem}
                        onToggleFolder={toggleFolder}
                        isOpen={openFolders.has(item.path)}
                        depth={0}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-gray-500 text-center">
                        No files or folders generated yet
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Bottom toolbar with stats */}
                <div className="p-3 bg-gray-50 border-t flex justify-between items-center" style={{ borderColor: colors.borderDefault }}>
                  <span className="text-xs text-gray-500">
                    {generationProgress === 100 
                      ? 'All files generated successfully' 
                      : 'Generating project structure...'}
                  </span>
                  
                  {generationProgress === 100 && (
                    <span className="text-xs text-gray-500">
                      {totalFiles} files in {fileStructure.filter(i => i.type === 'folder').length} folders
                    </span>
                  )}
                </div>
              </div>
              
              {/* Selected item details panel */}
              {selectedItem && (
                <div className="mt-6 border rounded-lg overflow-hidden" style={{ borderColor: colors.borderDefault }}>
                  <div className="p-4 bg-gray-50 border-b flex items-center" style={{ borderColor: colors.borderDefault }}>
                    <div className="mr-2">
                      {selectedItem.type === 'file' ? <FileIcon fileName={selectedItem.name} /> : <FolderIcon />}
                    </div>
                    <span className="font-medium text-gray-700">{selectedItem.path}</span>
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                      {selectedItem.type}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <span className="text-xs font-medium text-gray-500 uppercase">Details</span>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-gray-500">Name:</span>
                          <p className="text-sm font-mono">{selectedItem.name}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Type:</span>
                          <p className="text-sm font-mono capitalize">{selectedItem.type}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Path:</span>
                          <p className="text-sm font-mono truncate">{selectedItem.path}</p>
                        </div>
                        {selectedItem.type === 'file' && (
                          <div>
                            <span className="text-xs text-gray-500">Extension:</span>
                            <p className="text-sm font-mono">.{selectedItem.name.split('.').pop()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedItem.type === 'folder' && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Contents</span>
                        <div className="mt-2 max-h-32 overflow-y-auto">
                          <ul className="text-sm space-y-1">
                            {selectedItem.children && selectedItem.children.map((item, idx) => (
                              <li key={idx} className="flex items-center py-1">
                                <div className="mr-2">
                                  {item.type === 'file' ? <FileIcon fileName={item.name} /> : <FolderIcon />}
                                </div>
                                <span className="font-mono">{item.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {selectedItem.type === 'file' && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">Preview</span>
                        <div className="mt-2 p-3 bg-gray-50 rounded-md border font-mono text-sm text-gray-700" style={{ borderColor: colors.borderDefault }}>
                          <p className="text-gray-400">// Content preview for {selectedItem.name}</p>
                          <p className="text-gray-400">// This would display the actual file content in a real environment</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Actions panel */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => navigate('/tech-stack-selection')}
                  className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors duration-200"
                  style={{ 
                    color: colors.primary,
                    borderColor: colors.borderDefault,
                    backgroundColor: 'white'
                  }}
                >
                  <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Tech Stack
                </button>
                
                {generationProgress === 100 && (
                  <button
                    className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-md shadow-sm transition-all duration-200 text-white"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Project
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-xl font-medium mb-2 text-gray-700">No Project Structure Yet</h3>
              <p className="text-center max-w-md mb-8 text-gray-500">
                Click the button below to generate your project files and see your project structure.
              </p>
              <button
                onClick={handleGenerateScaffolding}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border text-base font-medium rounded-md shadow-sm transition-all duration-200 text-white"
                style={{ backgroundColor: colors.primary }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Generate Project Structure
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechStackConfirmation;