import React, { useState } from 'react';

function EntityCard({ entity }) {
  const [expanded, setExpanded] = useState(false);

  if (!entity) return null;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div 
        className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-150"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {entity.name || entity.Entity_Name || 'Unnamed Entity'}
        </h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          expanded ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {expanded ? 'Hide' : 'Show'}
        </span>
      </div>
      
      {expanded && (
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-700 mb-4">
            <span className="font-medium">Description:</span> {entity.description || entity.Entity_Description || 'No description available'}
          </p>
          
          <h4 className="text-sm font-medium text-gray-900 mb-2">Fields</h4>
          <ul className="divide-y divide-gray-200">
            {(entity.fields || entity.Fields || []).map((field, index) => (
              <li key={index} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 font-medium text-gray-900">{field.name || field || 'unnamed_field'}</span>
                  </div>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {field.type || 'string'}
                  </span>
                </div>
                {field.description && (
                  <p className="mt-1 text-xs text-gray-500">
                    {field.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EntityCard;