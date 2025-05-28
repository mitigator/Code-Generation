// import React, { useState, useEffect } from 'react';
// import {
//   Folder,
//   File,
//   ChevronRight,
//   ChevronDown,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   Code,
//   Loader,
//   Play,
//   Merge,
//   Database,
//   FileText
// } from 'lucide-react';
 
// const CodeRefinement = () => {
//   const [status, setStatus] = useState({
//     hasCodeGeneration: false,
//     hasCodeGenOutput: false,
//     hasCodeRefinement: false,
//     hasCodeRefinementInput: false,
//     hasRefinementCodeInput: false,
//     hasMergedCodeOutput: false,
//     needsRefinement: true,
//     canCombine: false,
//     canRefine: false,
//     canMerge: false
//   });
//   const [fileTree, setFileTree] = useState([]);
//   const [expandedFolders, setExpandedFolders] = useState(new Set());
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [mergeStatus, setMergeStatus] = useState(null);
//   const [combineStatus, setCombineStatus] = useState(null);
 
//   // Check status on component mount
//   useEffect(() => {
//     checkStatus();
//   }, []);
 
//   const checkStatus = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch('http://localhost:5000/api/code-refinement/status');
     
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
     
//       const data = await response.json();
     
//       if (data.success) {
//         setStatus(data);
       
//         // Display files from available data sources (priority order)
//         if (data.mergedCodeOutputData && data.mergedCodeOutputData.text) {
//           parseAndDisplayCode(data.mergedCodeOutputData);
//         } else if (data.codeRefinementData && data.codeRefinementData.text) {
//           parseAndDisplayRefinedCode(data.codeRefinementData);
//         } else if (data.codeGenerationData && data.codeGenerationData.text) {
//           parseAndDisplayCode(data.codeGenerationData);
//         } else if (data.codeGenOutputData && data.codeGenOutputData.text) {
//           parseAndDisplayCode(data.codeGenOutputData);
//         }
       
//       } else {
//         setError(data.message || 'Failed to check status');
//       }
//     } catch (err) {
//       setError(`Failed to connect to server: ${err.message}`);
//       console.error('Status check error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const combineFiles = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setCombineStatus(null);
     
//       const response = await fetch('http://localhost:5000/api/code-refinement/combine-json', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await response.json();
     
//       if (response.ok && data.success) {
//         setCombineStatus({
//           success: true,
//           message: data.message,
//           outputPath: data.outputPath
//         });
//         // Refresh status after combining
//         await checkStatus();
//       } else {
//         setError(data.message || 'Failed to combine files');
//       }
//     } catch (err) {
//       setError('Failed to combine files');
//       console.error('Combine error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const triggerRefinement = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch('http://localhost:5000/api/code-refinement/refine', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
     
//       const data = await response.json();
     
//       if (response.ok && data.success) {
//         // Refresh status after refinement
//         await checkStatus();
//       } else {
//         setError(data.message || 'Refinement failed');
//       }
//     } catch (err) {
//       setError('Failed to trigger refinement');
//       console.error('Refinement error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const handleMerge = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setMergeStatus(null);
     
//       const response = await fetch('http://localhost:5000/api/code-refinement/merge', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
     
//       const data = await response.json();
     
//       if (response.ok && data.success) {
//         setMergeStatus(data);
       
//         // Update file tree with merged data
//         if (data.data && data.data.text) {
//           try {
//             const parsedText = JSON.parse(data.data.text);
//             if (parsedText.project_files) {
//               const tree = buildFileTree(parsedText.project_files);
//               setFileTree(tree);
//             }
//           } catch (parseError) {
//             console.error('Error parsing merged data:', parseError);
//           }
//         }
       
//         // Refresh status after merge
//         await checkStatus();
//       } else {
//         setError(data.message || 'Merge failed');
//       }
//     } catch (err) {
//       setError('Failed to merge code');
//       console.error('Merge error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const parseAndDisplayCode = (codeData) => {
//     try {
//       let textToParse = codeData.text;
     
//       // Handle markdown code blocks (```json ... ```)
//       if (textToParse.includes('```json')) {
//         const jsonMatch = textToParse.match(/```json\s*([\s\S]*?)\s*```/);
//         if (jsonMatch && jsonMatch[1]) {
//           textToParse = jsonMatch[1].trim();
//         }
//       }
     
//       // Handle plain code blocks (``` ... ```)
//       if (textToParse.includes('```') && !textToParse.includes('```json')) {
//         const codeMatch = textToParse.match(/```\s*([\s\S]*?)\s*```/);
//         if (codeMatch && codeMatch[1]) {
//           textToParse = codeMatch[1].trim();
//         }
//       }
     
//       const parsedData = JSON.parse(textToParse);
//       if (parsedData.project_files) {
//         const tree = buildFileTree(parsedData.project_files);
//         setFileTree(tree);
//       }
//     } catch (err) {
//       // If JSON parsing fails, try to extract JSON from the text
//       try {
//         const jsonStart = codeData.text.indexOf('{');
//         const jsonEnd = codeData.text.lastIndexOf('}') + 1;
       
//         if (jsonStart !== -1 && jsonEnd > jsonStart) {
//           const extractedJson = codeData.text.substring(jsonStart, jsonEnd);
//           const parsedData = JSON.parse(extractedJson);
         
//           if (parsedData.project_files) {
//             const tree = buildFileTree(parsedData.project_files);
//             setFileTree(tree);
//             return;
//           }
//         }
       
//         setError('No valid project files found in the data');
//         console.error('Parse error - raw data:', codeData.text.substring(0, 200) + '...');
//       } catch (secondErr) {
//         setError('Failed to parse code data - invalid JSON format');
//         console.error('Parse error:', err);
//         console.error('Secondary parse error:', secondErr);
//         console.error('Raw data sample:', codeData.text.substring(0, 200) + '...');
//       }
//     }
//   };
 
//   const parseAndDisplayRefinedCode = (refinedData) => {
//     try {
//       let textToParse = refinedData.text;
     
//       // Handle markdown code blocks (```json ... ```)
//       if (textToParse.includes('```json')) {
//         const jsonMatch = textToParse.match(/```json\s*([\s\S]*?)\s*```/);
//         if (jsonMatch && jsonMatch[1]) {
//           textToParse = jsonMatch[1].trim();
//         }
//       }
     
//       // Handle plain code blocks (``` ... ```)
//       if (textToParse.includes('```') && !textToParse.includes('```json')) {
//         const codeMatch = textToParse.match(/```\s*([\s\S]*?)\s*```/);
//         if (codeMatch && codeMatch[1]) {
//           textToParse = codeMatch[1].trim();
//         }
//       }
     
//       // Try to parse as JSON first
//       let refinedFiles = [];
//       try {
//         const parsedData = JSON.parse(textToParse);
//         if (Array.isArray(parsedData)) {
//           refinedFiles = parsedData;
//         } else if (parsedData.project_files) {
//           refinedFiles = parsedData.project_files;
//         }
//       } catch (jsonErr) {
//         // If not JSON, might be direct array
//         refinedFiles = JSON.parse(textToParse);
//       }
     
//       if (refinedFiles && refinedFiles.length > 0) {
//         // Mark refined files
//         const markedFiles = refinedFiles.map(file => ({
//           ...file,
//           refined: true,
//           refinedAt: new Date().toISOString()
//         }));
       
//         const tree = buildFileTree(markedFiles);
//         setFileTree(tree);
//       }
//     } catch (err) {
//       setError('Failed to parse refined code data');
//       console.error('Parse refined error:', err);
//       console.error('Raw refined data sample:', refinedData.text?.substring(0, 200) + '...');
//     }
//   };
 
//   const buildFileTree = (files) => {
//     const tree = {};
   
//     files.forEach(file => {
//       const pathParts = file.file_path.split('/');
//       let current = tree;
     
//       pathParts.forEach((part, index) => {
//         if (!current[part]) {
//           const isFile = index === pathParts.length - 1;
//           current[part] = {
//             name: part,
//             type: isFile ? 'file' : 'folder',
//             path: pathParts.slice(0, index + 1).join('/'),
//             children: isFile ? null : {},
//             ...(isFile && {
//               code: file.code,
//               description: file.description,
//               refined: file.refined || false,
//               refinedAt: file.refinedAt,
//               originalDescription: file.originalDescription
//             })
//           };
//         }
//         if (current[part].type === 'folder') {
//           current = current[part].children;
//         }
//       });
//     });
   
//     return convertTreeToArray(tree);
//   };
 
//   const convertTreeToArray = (tree, parentPath = '') => {
//     const result = [];
   
//     Object.keys(tree).sort().forEach(key => {
//       const item = tree[key];
//       const fullPath = parentPath ? `${parentPath}/${key}` : key;
     
//       if (item.type === 'folder') {
//         result.push({
//           ...item,
//           path: fullPath,
//           children: convertTreeToArray(item.children, fullPath)
//         });
//       } else {
//         result.push({
//           ...item,
//           path: fullPath
//         });
//       }
//     });
   
//     return result;
//   };
 
//   const toggleFolder = (path) => {
//     const newExpanded = new Set(expandedFolders);
//     if (newExpanded.has(path)) {
//       newExpanded.delete(path);
//     } else {
//       newExpanded.add(path);
//     }
//     setExpandedFolders(newExpanded);
//   };
 
//   const selectFile = (file) => {
//     if (file.type === 'file') {
//       setSelectedFile(file);
//     }
//   };
 
//   const renderTreeItem = (item, level = 0) => {
//     const isExpanded = expandedFolders.has(item.path);
//     const indent = level * 20;
 
//     return (
//       <div key={item.path}>
//         <div
//           className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100 ${
//             selectedFile?.path === item.path ? 'bg-blue-100 border-l-4 border-blue-500' : ''
//           }`}
//           style={{ paddingLeft: `${12 + indent}px` }}
//           onClick={() => item.type === 'folder' ? toggleFolder(item.path) : selectFile(item)}
//         >
//           {item.type === 'folder' ? (
//             <>
//               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//               <Folder size={16} className="ml-2 text-blue-600" />
//               <span className="ml-2 font-medium">{item.name}</span>
//             </>
//           ) : (
//             <>
//               <File size={16} className={`ml-6 ${item.refined ? 'text-green-600' : 'text-gray-600'}`} />
//               <span className={`ml-2 ${item.refined ? 'text-green-800 font-medium' : ''}`}>
//                 {item.name}
//               </span>
//               {item.refined && (
//                 <CheckCircle size={14} className="ml-2 text-green-500" />
//               )}
//             </>
//           )}
//         </div>
       
//         {item.type === 'folder' && isExpanded && item.children && (
//           <div>
//             {item.children.map(child => renderTreeItem(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };
 
//   const getStatusInfo = () => {
//     if (status.hasMergedCodeOutput) {
//       return { message: "Merged code available", color: "text-green-600", icon: CheckCircle };
//     } else if (status.hasCodeRefinement) {
//       return { message: "Refinement completed - ready to merge", color: "text-blue-600", icon: Merge };
//     } else if (status.hasCodeRefinementInput) {
//       return { message: "Ready for refinement", color: "text-yellow-600", icon: Play };
//     } else if (status.canCombine) {
//       return { message: "Source files available - ready to combine", color: "text-purple-600", icon: Database };
//     } else {
//       return { message: "Waiting for source files", color: "text-gray-600", icon: FileText };
//     }
//   };
 
//   const statusInfo = getStatusInfo();
//   const StatusIcon = statusInfo.icon;
 
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg">
//           {/* Header */}
//           <div className="border-b border-gray-200 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Code Refinement</h1>
//                 <div className="flex items-center mt-1">
//                   <StatusIcon size={16} className={`mr-2 ${statusInfo.color}`} />
//                   <p className={`text-sm ${statusInfo.color}`}>{statusInfo.message}</p>
//                 </div>
//               </div>
             
//               <div className="flex items-center space-x-3">
//                 <button
//                   onClick={checkStatus}
//                   disabled={loading}
//                   className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
//                   Refresh
//                 </button>
               
//                 {status.canCombine && !status.hasCodeRefinementInput && (
//                   <button
//                     onClick={combineFiles}
//                     disabled={loading}
//                     className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
//                   >
//                     {loading ? <Loader size={16} className="mr-2 animate-spin" /> : <Database size={16} className="mr-2" />}
//                     Combine Files
//                   </button>
//                 )}
               
//                 {status.canRefine && !status.hasCodeRefinement && (
//                   <button
//                     onClick={triggerRefinement}
//                     disabled={loading}
//                     className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {loading ? <Loader size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
//                     Start Refinement
//                   </button>
//                 )}
               
//                 {status.canMerge && !status.hasMergedCodeOutput && (
//                   <button
//                     onClick={handleMerge}
//                     disabled={loading}
//                     className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
//                   >
//                     {loading ? <Loader size={16} className="mr-2 animate-spin" /> : <Merge size={16} className="mr-2" />}
//                     Merge Code
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
 
//           {/* Status Messages */}
//           {error && (
//             <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
//               <div className="flex items-center">
//                 <AlertCircle size={20} className="text-red-600 mr-2" />
//                 <span className="text-red-800">{error}</span>
//               </div>
//             </div>
//           )}
 
//           {combineStatus && (
//             <div className="mx-6 mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
//               <div className="flex items-center">
//                 <Database size={20} className="text-purple-600 mr-2" />
//                 <div>
//                   <span className="text-purple-800 font-medium">{combineStatus.message}</span>
//                   <p className="text-purple-700 text-sm mt-1">
//                     Output saved to: {combineStatus.outputPath}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
 
//           {mergeStatus && (
//             <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
//               <div className="flex items-center">
//                 <CheckCircle size={20} className="text-green-600 mr-2" />
//                 <div>
//                   <span className="text-green-800 font-medium">{mergeStatus.message}</span>
//                   <p className="text-green-700 text-sm mt-1">
//                     Refined {mergeStatus.summary?.refinedFiles || 0} out of {mergeStatus.summary?.totalFiles || 0} files
//                   </p>
//                   {mergeStatus.summary?.unchangedFiles > 0 && (
//                     <p className="text-green-700 text-sm">
//                       Kept {mergeStatus.summary.unchangedFiles} original files unchanged
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
 
//           {/* File Status Summary */}
//           <div className="px-6 py-4 bg-gray-50 border-b">
//             <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
//               <div className="flex items-center">
//                 <div className={`w-3 h-3 rounded-full mr-2 ${status.hasCodeGenOutput ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                 <span>Source Files</span>
//               </div>
//               <div className="flex items-center">
//                 <div className={`w-3 h-3 rounded-full mr-2 ${status.hasCodeRefinementInput ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                 <span>Combined</span>
//               </div>
//               <div className="flex items-center">
//                 <div className={`w-3 h-3 rounded-full mr-2 ${status.hasCodeRefinement ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                 <span>Refined</span>
//               </div>
//               <div className="flex items-center">
//                 <div className={`w-3 h-3 rounded-full mr-2 ${status.hasMergedCodeOutput ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                 <span>Merged</span>
//               </div>
//               <div className="flex items-center">
//                 <div className={`w-3 h-3 rounded-full mr-2 ${status.canCombine ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
//                 <span>Can Combine</span>
//               </div>
//               <div className="flex items-center">
//                 <div className={`w-3 h-3 rounded-full mr-2 ${status.canRefine ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
//                 <span>Can Refine</span>
//               </div>
//             </div>
//           </div>
 
//           {/* Main Content */}
//           <div className="flex h-screen">
//             {/* File Tree */}
//             <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
//               <div className="p-4 border-b border-gray-200">
//                 <h3 className="font-semibold text-gray-900">Project Files</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {fileTree.length > 0 ? `${fileTree.length} items` : 'No files loaded'}
//                 </p>
//               </div>
             
//               <div className="py-2">
//                 {fileTree.length > 0 ? (
//                   fileTree.map(item => renderTreeItem(item))
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     {!status.hasCodeGenOutput ? (
//                       <div>
//                         <FileText size={48} className="mx-auto mb-4 text-gray-400" />
//                         <p>No source files found</p>
//                         <p className="text-sm mt-2">Upload codeGenOutput.json and refinementCodeInput.json</p>
//                       </div>
//                     ) : !status.hasCodeRefinementInput ? (
//                       <div>
//                         <Database size={48} className="mx-auto mb-4 text-gray-400" />
//                         <p>Files ready to combine</p>
//                         <p className="text-sm mt-2">Click "Combine Files" to proceed</p>
//                       </div>
//                     ) : (
//                       <div>
//                         <Loader size={24} className="mx-auto animate-spin text-gray-400" />
//                         <p className="mt-2">Loading files...</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
 
//             {/* Code View */}
//             <div className="flex-1 flex flex-col">
//               {selectedFile ? (
//                 <>
//                   <div className="p-4 border-b border-gray-200 bg-gray-50">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
//                         <p className="text-sm text-gray-600">{selectedFile.path}</p>
//                         {selectedFile.description && (
//                           <p className="text-sm text-gray-700 mt-1">{selectedFile.description}</p>
//                         )}
//                         {selectedFile.originalDescription && selectedFile.originalDescription !== selectedFile.description && (
//                           <p className="text-sm text-gray-500 mt-1">
//                             <span className="font-medium">Original:</span> {selectedFile.originalDescription}
//                           </p>
//                         )}
//                       </div>
//                       {selectedFile.refined && (
//                         <div className="flex items-center text-green-600">
//                           <CheckCircle size={16} className="mr-1" />
//                           <span className="text-sm font-medium">Refined</span>
//                           {selectedFile.refinedAt && (
//                             <span className="text-xs text-gray-500 ml-2">
//                               {new Date(selectedFile.refinedAt).toLocaleString()}
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                 
//                   <div className="flex-1 overflow-auto">
//                     <pre className="p-4 text-sm font-mono bg-gray-900 text-gray-100 h-full overflow-auto">
//                       <code>{selectedFile.code}</code>
//                     </pre>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex-1 flex items-center justify-center text-gray-500">
//                   <div className="text-center">
//                     <File size={48} className="mx-auto mb-4 text-gray-400" />
//                     <p>Select a file to view its content</p>
//                     <p className="text-sm mt-2">Choose a file from the project tree on the left</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default CodeRefinement;
import React, { useState, useEffect } from 'react';
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Code,
  Loader,
  Play,
  Merge,
  Database,
  FileText
} from 'lucide-react';
 
const CodeRefinement = () => {
  const [status, setStatus] = useState({
    hasCodeGeneration: false,
    hasCodeGenOutput: false,
    hasCodeRefinement: false,
    hasCodeRefinementInput: false,
    hasRefinementCodeInput: false,
    hasMergedCodeOutput: false,
    needsRefinement: true,
    canCombine: false,
    canRefine: false,
    canMerge: false
  });
  const [fileTree, setFileTree] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mergeStatus, setMergeStatus] = useState(null);
  const [combineStatus, setCombineStatus] = useState(null);
 
  // Check status on component mount
  useEffect(() => {
    checkStatus();
  }, []);
 
  const checkStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/code-refinement/status');
     
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
     
      const data = await response.json();
     
      if (data.success) {
        setStatus(data);
       
        // Display files from available data sources (priority order)
        if (data.mergedCodeOutputData && data.mergedCodeOutputData.text) {
          parseAndDisplayCode(data.mergedCodeOutputData);
        } else if (data.codeRefinementData && data.codeRefinementData.text) {
          parseAndDisplayRefinedCode(data.codeRefinementData);
        } else if (data.codeGenerationData && data.codeGenerationData.text) {
          parseAndDisplayCode(data.codeGenerationData);
        } else if (data.codeGenOutputData && data.codeGenOutputData.text) {
          parseAndDisplayCode(data.codeGenOutputData);
        }
       
      } else {
        setError(data.message || 'Failed to check status');
      }
    } catch (err) {
      setError(`Failed to connect to server: ${err.message}`);
      console.error('Status check error:', err);
    } finally {
      setLoading(false);
    }
  };
 
  const combineFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      setCombineStatus(null);
     
      const response = await fetch('http://localhost:5000/api/code-refinement/combine-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
     
      if (response.ok && data.success) {
        setCombineStatus({
          success: true,
          message: data.message,
          outputPath: data.outputPath
        });
        // Refresh status after combining
        await checkStatus();
      } else {
        setError(data.message || 'Failed to combine files');
      }
    } catch (err) {
      setError('Failed to combine files');
      console.error('Combine error:', err);
    } finally {
      setLoading(false);
    }
  };
 
  const triggerRefinement = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/code-refinement/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      const data = await response.json();
     
      if (response.ok && data.success) {
        // Refresh status after refinement
        await checkStatus();
      } else {
        setError(data.message || 'Refinement failed');
      }
    } catch (err) {
      setError('Failed to trigger refinement');
      console.error('Refinement error:', err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleMerge = async () => {
    try {
      setLoading(true);
      setError(null);
      setMergeStatus(null);
     
      const response = await fetch('http://localhost:5000/api/code-refinement/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      const data = await response.json();
     
      if (response.ok && data.success) {
        setMergeStatus(data);
       
        // Update file tree with merged data
        if (data.data && data.data.text) {
          try {
            const parsedText = JSON.parse(data.data.text);
            if (parsedText.project_files) {
              const tree = buildFileTree(parsedText.project_files);
              setFileTree(tree);
            }
          } catch (parseError) {
            console.error('Error parsing merged data:', parseError);
          }
        }
       
        // Refresh status after merge
        await checkStatus();
      } else {
        setError(data.message || 'Merge failed');
      }
    } catch (err) {
      setError('Failed to merge code');
      console.error('Merge error:', err);
    } finally {
      setLoading(false);
    }
  };
 
  const parseAndDisplayCode = (codeData) => {
    try {
      let textToParse = codeData.text;
     
      // Handle markdown code blocks (```json ... ```)
      if (textToParse.includes('```json')) {
        const jsonMatch = textToParse.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          textToParse = jsonMatch[1].trim();
        }
      }
     
      // Handle plain code blocks (``` ... ```)
      if (textToParse.includes('```') && !textToParse.includes('```json')) {
        const codeMatch = textToParse.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch && codeMatch[1]) {
          textToParse = codeMatch[1].trim();
        }
      }
     
      const parsedData = JSON.parse(textToParse);
      if (parsedData.project_files) {
        const tree = buildFileTree(parsedData.project_files);
        setFileTree(tree);
      }
    } catch (err) {
      // If JSON parsing fails, try to extract JSON from the text
      try {
        const jsonStart = codeData.text.indexOf('{');
        const jsonEnd = codeData.text.lastIndexOf('}') + 1;
       
        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          const extractedJson = codeData.text.substring(jsonStart, jsonEnd);
          const parsedData = JSON.parse(extractedJson);
         
          if (parsedData.project_files) {
            const tree = buildFileTree(parsedData.project_files);
            setFileTree(tree);
            return;
          }
        }
       
        setError('No valid project files found in the data');
        console.error('Parse error - raw data:', codeData.text.substring(0, 200) + '...');
      } catch (secondErr) {
        setError('Failed to parse code data - invalid JSON format');
        console.error('Parse error:', err);
        console.error('Secondary parse error:', secondErr);
        console.error('Raw data sample:', codeData.text.substring(0, 200) + '...');
      }
    }
  };
 
  const parseAndDisplayRefinedCode = (refinedData) => {
    try {
      let textToParse = refinedData.text;
     
      // Handle markdown code blocks (```json ... ```)
      if (textToParse.includes('```json')) {
        const jsonMatch = textToParse.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          textToParse = jsonMatch[1].trim();
        }
      }
     
      // Handle plain code blocks (``` ... ```)
      if (textToParse.includes('```') && !textToParse.includes('```json')) {
        const codeMatch = textToParse.match(/```\s*([\s\S]*?)\s*```/);
        if (codeMatch && codeMatch[1]) {
          textToParse = codeMatch[1].trim();
        }
      }
     
      // Try to parse as JSON first
      let refinedFiles = [];
      try {
        const parsedData = JSON.parse(textToParse);
        if (Array.isArray(parsedData)) {
          refinedFiles = parsedData;
        } else if (parsedData.project_files) {
          refinedFiles = parsedData.project_files;
        }
      } catch (jsonErr) {
        // If not JSON, might be direct array
        refinedFiles = JSON.parse(textToParse);
      }
     
      if (refinedFiles && refinedFiles.length > 0) {
        // Mark refined files
        const markedFiles = refinedFiles.map(file => ({
          ...file,
          refined: true,
          refinedAt: new Date().toISOString()
        }));
       
        const tree = buildFileTree(markedFiles);
        setFileTree(tree);
      }
    } catch (err) {
      setError('Failed to parse refined code data');
      console.error('Parse refined error:', err);
      console.error('Raw refined data sample:', refinedData.text?.substring(0, 200) + '...');
    }
  };
 
  const buildFileTree = (files) => {
    const tree = {};
   
    files.forEach(file => {
      const pathParts = file.file_path.split('/');
      let current = tree;
     
      pathParts.forEach((part, index) => {
        if (!current[part]) {
          const isFile = index === pathParts.length - 1;
          current[part] = {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: pathParts.slice(0, index + 1).join('/'),
            children: isFile ? null : {},
            ...(isFile && {
              code: file.code,
              description: file.description,
              refined: file.refined || false,
              refinedAt: file.refinedAt,
              originalDescription: file.originalDescription
            })
          };
        }
        if (current[part].type === 'folder') {
          current = current[part].children;
        }
      });
    });
   
    return convertTreeToArray(tree);
  };
 
  const convertTreeToArray = (tree, parentPath = '') => {
    const result = [];
   
    Object.keys(tree).sort().forEach(key => {
      const item = tree[key];
      const fullPath = parentPath ? `${parentPath}/${key}` : key;
     
      if (item.type === 'folder') {
        result.push({
          ...item,
          path: fullPath,
          children: convertTreeToArray(item.children, fullPath)
        });
      } else {
        result.push({
          ...item,
          path: fullPath
        });
      }
    });
   
    return result;
  };
 
  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };
 
  const selectFile = (file) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };
 
  const renderTreeItem = (item, level = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    const indent = level * 20;
 
    return (
      <div key={item.path}>
        <div
          className={`flex items-center py-2 px-3 cursor-pointer hover:bg-gray-100 ${
            selectedFile?.path === item.path ? 'bg-blue-100 border-l-4 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${12 + indent}px` }}
          onClick={() => item.type === 'folder' ? toggleFolder(item.path) : selectFile(item)}
        >
          {item.type === 'folder' ? (
            <>
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <Folder size={16} className="ml-2 text-blue-600" />
              <span className="ml-2 font-medium">{item.name}</span>
            </>
          ) : (
            <>
              <File size={16} className={`ml-6 ${item.refined ? 'text-green-600' : 'text-gray-600'}`} />
              <span className={`ml-2 ${item.refined ? 'text-green-800 font-medium' : ''}`}>
                {item.name}
              </span>
              {item.refined && (
                <CheckCircle size={14} className="ml-2 text-green-500" />
              )}
            </>
          )}
        </div>
       
        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map(child => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
 
  const getStatusInfo = () => {
    if (status.hasMergedCodeOutput) {
      return { message: "Merged code available", color: "text-green-600", icon: CheckCircle };
    } else if (status.hasCodeRefinement) {
      return { message: "Refinement completed - ready to merge", color: "text-blue-600", icon: Merge };
    } else if (status.hasCodeRefinementInput) {
      return { message: "Ready for refinement", color: "text-yellow-600", icon: Play };
    } else if (status.canCombine) {
      return { message: "Source files available - ready to combine", color: "text-purple-600", icon: Database };
    } else {
      return { message: "Waiting for source files", color: "text-gray-600", icon: FileText };
    }
  };
 
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
 
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Code Refinement</h1>
                <div className="flex items-center mt-1">
                  <StatusIcon size={16} className={`mr-2 ${statusInfo.color}`} />
                  <p className={`text-sm ${statusInfo.color}`}>{statusInfo.message}</p>
                </div>
              </div>
             
              <div className="flex items-center space-x-3">
                <button
                  onClick={checkStatus}
                  disabled={loading}
                  className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
               
                {status.canCombine && !status.hasCodeRefinementInput && (
                  <button
                    onClick={combineFiles}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? <Loader size={16} className="mr-2 animate-spin" /> : <Database size={16} className="mr-2" />}
                    Combine Files
                  </button>
                )}
               
                {status.canRefine && !status.hasCodeRefinement && (
                  <button
                    onClick={triggerRefinement}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? <Loader size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
                    Start Refinement
                  </button>
                )}
               
                {status.canMerge && !status.hasMergedCodeOutput && (
                  <button
                    onClick={handleMerge}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? <Loader size={16} className="mr-2 animate-spin" /> : <Merge size={16} className="mr-2" />}
                    Merge Code
                  </button>
                )}
              </div>
            </div>
          </div>
 
          {/* Status Messages */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}
 
          {combineStatus && (
            <div className="mx-6 mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
              <div className="flex items-center">
                <Database size={20} className="text-purple-600 mr-2" />
                <div>
                  <span className="text-purple-800 font-medium">{combineStatus.message}</span>
                  <p className="text-purple-700 text-sm mt-1">
                    Output saved to: {combineStatus.outputPath}
                  </p>
                </div>
              </div>
            </div>
          )}
 
          {mergeStatus && (
            <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-600 mr-2" />
                <div>
                  <span className="text-green-800 font-medium">{mergeStatus.message}</span>
                  <p className="text-green-700 text-sm mt-1">
                    Refined {mergeStatus.summary?.refinedFiles || 0} out of {mergeStatus.summary?.totalFiles || 0} files
                  </p>
                  {mergeStatus.summary?.unchangedFiles > 0 && (
                    <p className="text-green-700 text-sm">
                      Kept {mergeStatus.summary.unchangedFiles} original files unchanged
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
 
          {/* File Status Summary */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${status.hasCodeGenOutput ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Source Files</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${status.hasCodeRefinementInput ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Combined</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${status.hasCodeRefinement ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Refined</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${status.hasMergedCodeOutput ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Merged</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${status.canCombine ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <span>Can Combine</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${status.canRefine ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <span>Can Refine</span>
              </div>
            </div>
          </div>
 
          {/* Main Content */}
          <div className="flex h-96" style={{ height: '600px' }}>
            {/* File Tree */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="font-semibold text-gray-900">Project Files</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {fileTree.length > 0 ? `${fileTree.length} items` : 'No files loaded'}
                </p>
              </div>
             
              <div 
                className="flex-1 overflow-y-auto py-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e0 #f7fafc'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 8px;
                  }
                  div::-webkit-scrollbar-track {
                    background: #f7fafc;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 4px;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: #a0aec0;
                  }
                `}</style>
                {fileTree.length > 0 ? (
                  fileTree.map(item => renderTreeItem(item))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {!status.hasCodeGenOutput ? (
                      <div>
                        <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                        <p>No source files found</p>
                        <p className="text-sm mt-2">Upload codeGenOutput.json and refinementCodeInput.json</p>
                      </div>
                    ) : !status.hasCodeRefinementInput ? (
                      <div>
                        <Database size={48} className="mx-auto mb-4 text-gray-400" />
                        <p>Files ready to combine</p>
                        <p className="text-sm mt-2">Click "Combine Files" to proceed</p>
                      </div>
                    ) : (
                      <div>
                        <Loader size={24} className="mx-auto animate-spin text-gray-400" />
                        <p className="mt-2">Loading files...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
 
            {/* Code View */}
            <div className="flex-1 flex flex-col">
              {selectedFile ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                        <p className="text-sm text-gray-600">{selectedFile.path}</p>
                        {selectedFile.description && (
                          <p className="text-sm text-gray-700 mt-1">{selectedFile.description}</p>
                        )}
                        {selectedFile.originalDescription && selectedFile.originalDescription !== selectedFile.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Original:</span> {selectedFile.originalDescription}
                          </p>
                        )}
                      </div>
                      {selectedFile.refined && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-sm font-medium">Refined</span>
                          {selectedFile.refinedAt && (
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(selectedFile.refinedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                 
                  <div 
                    className="flex-1 bg-gray-900 relative overflow-hidden"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#4a5568 #2d3748',
                      maxHeight: '100%'
                    }}
                  >
                    <style jsx>{`
                      .code-container {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        overflow: auto;
                      }
                      .code-container::-webkit-scrollbar {
                        width: 12px;
                        height: 12px;
                      }
                      .code-container::-webkit-scrollbar-track {
                        background: #2d3748;
                      }
                      .code-container::-webkit-scrollbar-thumb {
                        background: #4a5568;
                        border-radius: 6px;
                      }
                      .code-container::-webkit-scrollbar-thumb:hover {
                        background: #718096;
                      }
                      .code-container::-webkit-scrollbar-corner {
                        background: #2d3748;
                      }
                    `}</style>
                    <pre 
                      className="code-container p-4 text-sm font-mono text-gray-100 whitespace-pre-wrap"
                    >
                      <code>{selectedFile.code}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                  <div className="text-center">
                    <File size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>Select a file to view its content</p>
                    <p className="text-sm mt-2">Choose a file from the project tree on the left</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default CodeRefinement;