
import React from 'react';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
};

export default Header;
