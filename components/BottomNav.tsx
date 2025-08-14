import React from 'react';
import { View } from '../types';
import { 
    NewsIcon,
    ParkingIcon,
    ExtrasIcon, 
    BalineseIcon, 
    DisabilityIcon,
    BikeIcon,
} from './icons/NavIcons';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'text-blue-600 dark:text-blue-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300';

  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}>
      <div className={`p-1 ${isActive ? 'scale-110' : ''}`}>{icon}</div>
      <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: View.News, label: 'Novedades', icon: <NewsIcon /> },
    { view: View.Parking, label: 'Parking', icon: <ParkingIcon /> },
    { view: View.Bikes, label: 'Bicis', icon: <BikeIcon /> },
    { view: View.Balinese, label: 'Balinesas', icon: <BalineseIcon /> },
    { view: View.Extras, label: 'Restaurante', icon: <ExtrasIcon /> },
    { view: View.Disability, label: 'Accesibilidad', icon: <DisabilityIcon /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around items-center h-full max-w-2xl mx-auto px-2">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNav;