// components/TattooLoadingAnimation.tsx
import React from 'react';

const TattooLoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full">
      <svg width="200" height="200" viewBox="0 0 200 200" className="tattoo-machine">
        <g className="machine">
          <rect x="80" y="10" width="40" height="100" fill="#333" />
          <circle cx="100" cy="130" r="20" fill="#666" />
          <rect x="95" y="110" width="10" height="60" fill="#999">
            <animate 
              attributeName="height" 
              values="60;55;60" 
              dur="0.5s" 
              repeatCount="indefinite"
            />
          </rect>
        </g>
        <path 
          d="M50,150 Q100,100 150,150" 
          fill="none" 
          stroke="#000" 
          strokeWidth="2"
          strokeDasharray="200"
          strokeDashoffset="200"
        >
          <animate 
            attributeName="stroke-dashoffset" 
            from="200" 
            to="0" 
            dur="2s" 
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Creating your tattoo design...</p>
    </div>
  );
};

export default TattooLoadingAnimation;