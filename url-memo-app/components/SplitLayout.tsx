import React, { ReactNode, useEffect, useState } from 'react';

interface SplitLayoutProps {
  children: [ReactNode, ReactNode];
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div 
      data-testid="split-layout"
      className={`grid h-full ${isMobile ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-2'}`}
    >
      <div data-testid="left-pane" className="w-full h-full overflow-auto p-2">
        {children[0]}
      </div>
      <div 
        data-testid="right-pane" 
        className={`w-full h-full overflow-auto p-1 ${!isMobile ? 'border-l border-gray-300' : 'border-t border-gray-300 mt-4'}`}
      >
        {children[1]}
      </div>
    </div>
  );
};