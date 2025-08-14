import React, { useState } from 'react';
import { View } from './types';
import BottomNav from './components/BottomNav';
import BalineseView from './views/BalineseView';
import ExtrasView from './views/ExtrasView';
import NewsView from './views/NewsView';
import ParkingView from './views/ParkingView';
import DisabilityView from './views/DisabilityView';
import BikesView from './views/BikesView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.News);

  const renderView = () => {
    switch (activeView) {
      case View.News:
        return <NewsView />;
      case View.Parking:
        return <ParkingView />;
      case View.Bikes:
        return <BikesView />;
      case View.Balinese:
        return <BalineseView />;
      case View.Extras:
        return <ExtrasView />;
      case View.Disability:
        return <DisabilityView />;
      default:
        return <NewsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <main className="pb-24 max-w-2xl mx-auto">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;
