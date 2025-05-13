import React from 'react';

function Loader({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block relative">
          {/* Animated spinner */}
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          
          {/* Optional: Logo or icon can be placed here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        
        {/* Loading text with nice typography */}
        <p className="mt-4 text-lg font-medium text-gray-700">{text}</p>
        
        {/* Optional: Subtext can be added */}
        {/* <p className="mt-1 text-sm text-gray-500">This may take a few moments</p> */}
      </div>
    </div>
  );
}

export default Loader;