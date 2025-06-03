import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../services/ThemeContext';
import { themes } from '../assets/template';

// File type icons with color coding
const FileIcon = ({ fileName, colors }) => {
  const getFileType = (name) => {
    const ext = name.split('.').pop().toLowerCase();

    const iconMap = {
      js: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.warning }}>
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
        </svg>
      ),
      jsx: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.info }}>
          <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z" />
        </svg>
      ),
      json: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.textSecondary }}>
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-3.5 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
      ),
      css: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.info }}>
          <path d="M5 3l-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81-5.48 1.81-4.75-1.81.33-1.64H2.85l-.79 4.02L12 21l8.85-2.94L23.1 3z"/>
        </svg>
      ),
      html: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.warning }}>
          <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z"/>
        </svg>
      ),
      env: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.success }}>
          <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.001 14H4z" />
          <path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z" />
        </svg>
      ),
      md: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.info }}>
          <path d="M14.345 6H5.5a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-6.879A1.5 1.5 0 0 0 19.56 8.5H16.5a1.5 1.5 0 0 1-1.5-1.5V4.06A1.5 1.5 0 0 0 13.94 3h-.094zM14.5 6.75V4.06a.06.06 0 0 1 .06-.06h.094a.06.06 0 0 1 .042.017l2.329 2.329a.06.06 0 0 1 .017.042v.062a.06.06 0 0 1-.06.06H15a.5.5 0 0 1-.5-.5z" />
          <path d="M6.75 12.75v-4.5h1.442l1.442 1.5 1.442-1.5h1.424v4.5h-1.424v-3l-1.442 1.5-1.442-1.5v3H6.75zm7.5-4.5h1.5v3h1.5v1.5h-3v-4.5z" />
        </svg>
      ),
      yml: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.secondary }}>
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
        </svg>
      )
    };

    return iconMap[ext] || (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: colors.textSecondary }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return getFileType(fileName);
};

const FolderIcon = ({ isOpen, colors }) => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.warning }}>
    {isOpen ? (
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    ) : (
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    )}
  </svg>
);

// Enhanced Tree lines component for proper hierarchical display
const TreeLines = ({ isLast, hasChildren, isOpen, depth, ancestors, colors }) => {
  const lines = [];
  
  // Draw vertical lines for ancestors
  for (let i = 0; i < depth; i++) {
    const shouldDrawLine = i < ancestors.length && !ancestors[i];
    lines.push(
      <div
        key={`line-${i}`}
        className="absolute w-px"
        style={{
          left: `${i * 24 + 12}px`,
          top: 0,
          bottom: shouldDrawLine ? 0 : '50%',
          height: shouldDrawLine ? '100%' : '50%',
          backgroundColor: colors.borderDefault
        }}
      />
    );
  }

  // Draw horizontal line to the item
  if (depth > 0) {
    lines.push(
      <div
        key="horizontal"
        className="absolute h-px"
        style={{
          left: `${(depth - 1) * 24 + 12}px`,
          top: '50%',
          width: '12px',
          backgroundColor: colors.borderDefault
        }}
      />
    );
  }

  // Draw corner
  if (depth > 0) {
    lines.push(
      <div
        key="corner"
        className="absolute w-px"
        style={{
          left: `${(depth - 1) * 24 + 12}px`,
          top: 0,
          height: '50%',
          backgroundColor: colors.borderDefault
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {lines}
    </div>
  );
};

// Enhanced File/Folder Item Component with better tree structure
const FileItem = ({
  item,
  index,
  totalItems,
  generationProgress,
  onSelect,
  selectedItem,
  openFolders,
  onToggleFolder,
  depth = 0,
  isLast = false,
  ancestors = [],
  colors
}) => {
  const isSelected = selectedItem && selectedItem.path === item.path;
  const isGenerating = generationProgress < 100;
  const shouldShow = (index / totalItems) * 100 <= generationProgress;
  const isFile = item.type === 'file';
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openFolders.has(item.path);

  // Animation timing based on index
  const animationDelay = index * 50;

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${shouldShow ? 'opacity-100' : 'opacity-0'}`}
      style={{
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <div className="relative">
        {/* Tree lines */}
        <TreeLines
          isLast={isLast}
          hasChildren={hasChildren}
          isOpen={isOpen}
          depth={depth}
          ancestors={ancestors}
          colors={colors}
        />
        
        {/* Item content */}
        <div
          className={`relative flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
            isSelected ? 'shadow-md' : ''
          }`}
          style={{ 
            paddingLeft: `${depth * 24 + 32}px`,
            minHeight: '36px',
            backgroundColor: isSelected ? `${colors.primary}10` : 'transparent',
            borderLeft: isSelected ? `3px solid ${colors.primary}` : '3px solid transparent',
            color: colors.textPrimary
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = `${colors.primary}05`;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          onClick={() => {
            if (isFile) {
              onSelect(item);
            } else {
              onToggleFolder(item.path);
            }
          }}
        >
          {/* Expand/collapse icon for folders */}
          {!isFile && hasChildren && (
            <div className="mr-2 flex-shrink-0">
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  isOpen ? 'rotate-90' : ''
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                style={{ color: colors.textSecondary }}
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          {/* File/Folder icon */}
          <div className="mr-3 flex-shrink-0">
            {isFile ? (
              <FileIcon fileName={item.name} colors={colors} />
            ) : (
              <FolderIcon isOpen={isOpen} colors={colors} />
            )}
          </div>
          
          {/* Name */}
          <span className="text-sm font-medium truncate" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {item.name}
            {!isFile && '/'}
          </span>

          {/* File extension badge */}
          {isFile && item.name.includes('.') && (
            <span 
              className="ml-auto text-xs px-2 py-1 rounded-full font-mono"
              style={{ 
                backgroundColor: `${colors.textLight}20`, 
                color: colors.textLight 
              }}
            >
              .{item.name.split('.').pop()}
            </span>
          )}

          {/* Generation progress indicator */}
          {isGenerating && index === Math.floor((generationProgress / 100) * totalItems) && (
            <svg className="ml-auto animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: colors.primary }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
      </div>

      {/* Render children if folder is open */}
      {!isFile && isOpen && hasChildren && (
        <div>
          {item.children.map((child, childIndex) => {
            const isChildLast = childIndex === item.children.length - 1;
            const newAncestors = [...ancestors, isLast];
            
            return (
              <FileItem
                key={`${child.path}-${childIndex}`}
                item={child}
                index={childIndex}
                totalItems={item.children.length}
                generationProgress={100} // Children should show immediately when parent is open
                onSelect={onSelect}
                selectedItem={selectedItem}
                openFolders={openFolders}
                onToggleFolder={onToggleFolder}
                depth={depth + 1}
                isLast={isChildLast}
                ancestors={newAncestors}
                colors={colors}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Project generation status component
const GenerationStatus = ({ progress, filesGenerated, totalFiles, colors }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          Generating project files...
        </div>
        <div className="text-sm font-semibold" style={{ color: colors.primary }}>
          {filesGenerated} / {totalFiles} files
        </div>
      </div>
      <div className="w-full rounded-full h-3" style={{ backgroundColor: `${colors.primary}20` }}>
        <div
          className="h-3 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${progress}%`,
            backgroundColor: colors.primary
          }}
        ></div>
      </div>
    </div>
  );
};

// Fixed buildFileTree function to eliminate duplicates
const buildFileTree = (foldersStr, filesStr) => {
  const root = { name: 'root', path: '', type: 'folder', children: [] };
  const pathMap = new Map(); // Use Map to track all created paths
  
  // Helper function to create or get a folder node
  const createOrGetFolder = (path, name) => {
    if (pathMap.has(path)) {
      return pathMap.get(path);
    }
    
    const folderNode = {
      name: name,
      path: path,
      type: 'folder',
      children: []
    };
    
    pathMap.set(path, folderNode);
    return folderNode;
  };

  // First, process all files and create necessary folder structure
  if (filesStr) {
    const fileLines = filesStr.split('\n').filter(line => line.trim());
    
    fileLines.forEach(filePath => {
      const trimmedPath = filePath.trim();
      const parts = trimmedPath.split('/');
      const fileName = parts.pop();
      
      if (!fileName) return;
      
      // Create folder hierarchy for this file
      let current = root;
      let currentPath = '';
      
      parts.forEach(part => {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        // Check if folder already exists
        let found = current.children.find(child => 
          child.type === 'folder' && child.name === part
        );
        
        if (!found) {
          // Create new folder
          found = createOrGetFolder(currentPath, part);
          current.children.push(found);
        }
        
        current = found;
      });
      
      // Add the file to its parent folder
      const fileNode = {
        name: fileName,
        path: trimmedPath,
        type: 'file'
      };
      
      current.children.push(fileNode);
    });
  }

  // Sort all children recursively (folders first, then alphabetically)
  const sortAllChildren = (node) => {
    if (node.children && node.children.length > 0) {
      node.children.sort((a, b) => {
        // Folders first
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        // Then alphabetically
        return a.name.localeCompare(b.name);
      });
      
      // Recursively sort children
      node.children.forEach(child => {
        if (child.type === 'folder') {
          sortAllChildren(child);
        }
      });
    }
  };

  sortAllChildren(root);
  return root.children;
};

function TechStackConfirmation() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const colors = themes[currentTheme].colors;
  
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

  // Replace the handleGenerateScaffolding function with this version:

const handleGenerateScaffolding = async () => {
  setLoading(true);
  setError(''); // Clear any existing errors
  setSelectedItem(null);
  setOpenFolders(new Set()); // Reset open folders

  try {
    const response = await axios.post('http://localhost:5000/api/generate-scaffolding');

    if (response.data?.data?.json) {
      const data = response.data.data.json;
      setScaffoldingData(data);

      // Build the file tree structure with fixed parsing
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

      // Auto-expand first level folders
      const firstLevelFolders = structure.filter(item => item.type === 'folder').map(folder => folder.path);
      setOpenFolders(new Set(firstLevelFolders));
    } else {
      throw new Error('Invalid scaffolding data received');
    }
  } catch (error) {
    console.error('Error generating scaffolding:', error);
    
    // Only show user-friendly errors, hide network errors
    if (error.code === 'ECONNREFUSED' || 
        error.code === 'ERR_NETWORK' || 
        error.message.includes('Network Error') ||
        error.message.includes('connect ECONNREFUSED') ||
        error.response?.status >= 500) {
      // Network or server errors - log but don't show to user
      console.log('Network/Server error occurred, but not showing to user:', error.message);
      
      // Optionally, you could show a generic message or try to generate mock data
      // For now, we'll just fail silently and keep the loading state false
    } else {
      // Only show application-level errors to users
      setError('Unable to generate project structure at this time. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  // Handle item selection
  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  // Auto-generate on page load
  useEffect(() => {
    handleGenerateScaffolding();
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Filter files based on search query
  const filterTree = (nodes, query) => {
    if (!query) return nodes;
    
    return nodes.filter(node => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        return true;
      }
      if (node.children) {
        const filteredChildren = filterTree(node.children, query);
        return filteredChildren.length > 0;
      }
      return false;
    }).map(node => {
      if (node.children) {
        return {
          ...node,
          children: filterTree(node.children, query)
        };
      }
      return node;
    });
  };

  const filteredFileStructure = filterTree(fileStructure, searchQuery);

  return (
    <div
      className="min-h-screen font-sans"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}30 100%)`,
        color: colors.textPrimary
      }}
    >
      {/* Navbar */}
      <Navbar />

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress tracker */}
         <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderDefault}` }}>
            <div className="flex items-center justify-between">
              {[
                { id: 1, name: 'Project Setup', current: false, completed: true },
                { id: 2, name: 'Entity Generation', current: false, completed: true },
                { id: 3, name: 'TechStack Selection', current: false, completed: true },
                { id: 4, name: 'Folder Scaffolding', current: true, completed: false },
                { id: 5, name: 'Code Generation', current: false, completed: false },
                { id: 6, name: 'Code Refinement', current: false, completed: false }
              ].map((step, stepIdx) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 ${step.completed || step.current ? 'text-white' : 'text-gray-500'
                        }`}
                      style={{
                        backgroundColor: step.completed
                          ? colors.success
                          : step.current
                            ? colors.primary
                            : `${colors.textLight}40`
                      }}
                    >
                      {step.completed ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <span
                        className={`text-sm font-medium ${step.completed || step.current ? '' : 'opacity-50'
                          }`}
                        style={{
                          color: step.completed || step.current ? colors.textPrimary : colors.textLight
                        }}
                      >
                        {step.name}
                      </span>
                      {step.current && (
                        <div className="flex items-center mt-1">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{ backgroundColor: colors.primary }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{
                                backgroundColor: colors.primary,
                                animationDelay: '0.2s'
                              }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full animate-pulse"
                              style={{
                                backgroundColor: colors.primary,
                                animationDelay: '0.4s'
                              }}
                            ></div>
                          </div>
                          <span
                            className="ml-2 text-xs"
                            style={{ color: colors.primary }}
                          >
                            In Progress
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {stepIdx < 5 && (
                    <div className="flex-1 mx-2 sm:mx-4">
                      <div
                        className="h-0.5 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: step.completed
                            ? colors.success
                            : step.current
                              ? `${colors.primary}50`
                              : `${colors.textLight}30`
                        }}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile view - show only current step prominently */}
            <div className="sm:hidden mt-4 text-center">
              <div
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${colors.primary}15`,
                  color: colors.primary
                }}
              >
                Step 3 of 6: TechStack Selection
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
            className="shadow-lg rounded-xl overflow-hidden"
            style={{
              backgroundColor: colors.surface,
              boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
            }}
          >
            {/* Header with regenerate button */}
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
                className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg shadow-sm transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed hover:shadow-md"
                style={{
                  color: 'white',
                  backgroundColor: colors.primary,
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }
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
                ) : (
                  <>
                    <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Regenerate Project
                  </>
                )}
              </button>
            </div>

            {/* Show progress indicator during generation */}
            {generationProgress > 0 && generationProgress < 100 && (
              <div className="px-6 py-4" style={{ backgroundColor: `${colors.primary}05` }}>
                <GenerationStatus
                  progress={generationProgress}
                  filesGenerated={filesGenerated}
                  totalFiles={totalFiles}
                  colors={colors}
                />
              </div>
            )}

            {/* Main content area */}
            <div className="p-6">
              {scaffoldingData ? (
                <>
                  {/* Search input */}
                  <div className="mb-6 relative">
                    <input
                      type="text"
                      placeholder="Search files and folders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ 
                        borderColor: colors.borderDefault,
                        backgroundColor: colors.background,
                        color: colors.textPrimary,
                        focusRingColor: colors.primary
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.borderDefault;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <div className="absolute left-4 top-3.5">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textLight }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Folder expand/collapse all buttons */}
                  <div className="mb-6 flex gap-3">
                    <button
                      onClick={() => {
                        const allFolderPaths = [];
                        const collectPaths = (nodes) => {
                          nodes.forEach(node => {
                            if (node.type === 'folder') {
                              allFolderPaths.push(node.path);
                              if (node.children) collectPaths(node.children);
                            }
                          });
                        };
                        collectPaths(fileStructure);
                        setOpenFolders(new Set(allFolderPaths));
                      }}
                      className="text-xs px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        color: colors.primary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.primary}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.primary}15`;
                      }}
                    >
                      Expand All
                    </button>
                    <button
                      onClick={() => setOpenFolders(new Set())}
                      className="text-xs px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
                      style={{
                        backgroundColor: `${colors.textLight}15`,
                        color: colors.textSecondary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.textLight}25`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.textLight}15`;
                      }}
                    >
                      Collapse All
                    </button>
                  </div>

                  {/* File structure container with enhanced tree display */}
                  <div
                    className="border rounded-xl overflow-hidden"
                    style={{ borderColor: colors.borderDefault }}
                  >
                    <div className="p-4 border-b flex items-center" style={{ borderColor: colors.borderDefault, backgroundColor: `${colors.primary}05` }}>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.primary }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span className="font-semibold" style={{ color: colors.textPrimary }}>Project Structure</span>
                      </div>
                      {generationProgress === 100 && (
                        <div className="ml-auto flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.success }}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium" style={{ color: colors.success }}>Complete</span>
                        </div>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto p-4" style={{ backgroundColor: `${colors.primary}02` }}>
                      {filteredFileStructure.length > 0 ? (
                        <div className="relative">
                          {filteredFileStructure.map((item, index) => {
                            const isLast = index === filteredFileStructure.length - 1;
                            return (
                              <FileItem
                                key={`${item.path}-${index}`}
                                item={item}
                                index={index}
                                totalItems={filteredFileStructure.length}
                                generationProgress={generationProgress}
                                onSelect={handleSelectItem}
                                selectedItem={selectedItem}
                                openFolders={openFolders}
                                onToggleFolder={toggleFolder}
                                depth={0}
                                isLast={isLast}
                                ancestors={[]}
                                colors={colors}
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textLight }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          </svg>
                          <p className="text-center" style={{ color: colors.textSecondary }}>
                            {searchQuery ? 'No files match your search' : 'No files or folders generated yet'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom toolbar with stats */}
                    <div className="p-4 border-t flex justify-between items-center" style={{ borderColor: colors.borderDefault, backgroundColor: `${colors.primary}05` }}>
                      <span className="text-sm" style={{ color: colors.textSecondary }}>
                        {generationProgress === 100
                          ? 'All files generated successfully'
                          : 'Generating project structure...'}
                      </span>

                      {generationProgress === 100 && (
                        <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                          {totalFiles} files in {fileStructure.filter(i => i.type === 'folder').length} folders
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selected item details panel */}
                  {selectedItem && (
                    <div className="mt-6 border rounded-xl overflow-hidden" style={{ borderColor: colors.borderDefault }}>
                      <div className="p-4 border-b flex items-center" style={{ borderColor: colors.borderDefault, backgroundColor: `${colors.primary}05` }}>
                        <div className="mr-3">
                          {selectedItem.type === 'file' ? 
                            <FileIcon fileName={selectedItem.name} colors={colors} /> : 
                            <FolderIcon colors={colors} />
                          }
                        </div>
                        <span className="font-medium font-mono" style={{ color: colors.textPrimary }}>{selectedItem.path}</span>
                        <span className="ml-auto text-xs px-3 py-1 rounded-full font-medium capitalize" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                          {selectedItem.type}
                        </span>
                      </div>

                      <div className="p-4" style={{ backgroundColor: colors.surface }}>
                        <div className="mb-4">
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textLight }}>Details</span>
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>Name:</span>
                              <p className="text-sm font-mono mt-1" style={{ color: colors.textPrimary }}>{selectedItem.name}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>Type:</span>
                              <p className="text-sm font-mono capitalize mt-1" style={{ color: colors.textPrimary }}>{selectedItem.type}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>Path:</span>
                              <p className="text-sm font-mono break-all mt-1" style={{ color: colors.textPrimary }}>{selectedItem.path}</p>
                            </div>
                            {selectedItem.type === 'file' && selectedItem.name.includes('.') && (
                              <div>
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>Extension:</span>
                                <p className="text-sm font-mono mt-1" style={{ color: colors.textPrimary }}>.{selectedItem.name.split('.').pop()}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedItem.type === 'folder' && selectedItem.children && (
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textLight }}>Contents ({selectedItem.children.length} items)</span>
                            <div className="mt-3 max-h-32 overflow-y-auto">
                              <div className="space-y-2">
                                {selectedItem.children.map((item, idx) => (
                                  <div key={idx} className="flex items-center py-2 px-3 rounded-lg transition-colors duration-200" style={{ backgroundColor: `${colors.primary}05` }}>
                                    <div className="mr-3">
                                      {item.type === 'file' ? 
                                        <FileIcon fileName={item.name} colors={colors} /> : 
                                        <FolderIcon colors={colors} />
                                      }
                                    </div>
                                    <span className="font-mono text-sm" style={{ color: colors.textPrimary }}>{item.name}</span>
                                    <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.textLight}15`, color: colors.textSecondary }}>
                                      {item.type}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedItem.type === 'file' && (
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textLight }}>Preview</span>
                            <div className="mt-3 p-4 rounded-lg border font-mono text-sm" style={{ borderColor: colors.borderDefault, backgroundColor: colors.background, color: colors.textSecondary }}>
                              <p className="opacity-75">// Content preview for {selectedItem.name}</p>
                              <p className="opacity-75">// This would display the actual file content in a real environment</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions panel */}
                  <div className="mt-8 flex justify-between items-center">
                    <button
                      onClick={() => navigate('/tech-stack-selection')}
                      className="inline-flex items-center px-6 py-3 border text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                      style={{
                        color: colors.primary,
                        borderColor: colors.borderDefault,
                        backgroundColor: colors.surface
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.primary}05`;
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.surface;
                        e.currentTarget.style.borderColor = colors.borderDefault;
                      }}
                    >
                      <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back to Tech Stack
                    </button>

                    {generationProgress === 100 && (
                      <button
                        onClick={() => {
                          // 1. Make the API call to the specified endpoint
                          fetch('http://localhost:5000/api/combine-json')
                            .then(response => response.json())
                            .then(data => {
                              console.log('Combine JSON response:', data);
                              // No UI updates, just logging to console
                            })
                            .catch(error => {
                              console.error('Error calling combine-json API:', error);
                            });

                          // 2. Also navigate to the frontend route
                          navigate('/code-generation');
                        }}
                        className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg shadow-sm transition-all duration-200 text-white hover:shadow-md"
                        style={{ backgroundColor: colors.success }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.successDark || colors.success;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.success;
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Continue to Code Generation
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="w-24 h-24 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.textLight }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-xl font-medium mb-2" style={{ color: colors.textPrimary }}>Generating Project Structure</h3>
                  <p className="text-center max-w-md" style={{ color: colors.textSecondary }}>
                    Please wait while we generate your project files and structure...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechStackConfirmation