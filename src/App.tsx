import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomeView } from './views/HomeView';
import { BlochSphereView } from './views/BlochSphereView';
import { GatesView } from './views/GatesView';
import { CircuitsView } from './views/CircuitsView';
import { SimulateView } from './views/SimulateView';
import { ConceptsView } from './views/ConceptsView';
import { ProblemsView } from './views/ProblemsView';
import { VisualizationsView } from './views/VisualizationsView';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return localStorage.getItem('ql_current_tab') || 'qubits';
  });

  const [isExplorerMode, setIsExplorerMode] = useState<boolean>(() => {
    return localStorage.getItem('ql_mode') === 'explorer';
  });

  useEffect(() => {
    localStorage.setItem('ql_current_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    localStorage.setItem('ql_mode', isExplorerMode ? 'explorer' : 'beginner');
  }, [isExplorerMode]);

  const handleToggleExplorerMode = () => {
    setIsExplorerMode(prev => !prev);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView onNavigate={tab => setCurrentTab(tab)} />;
      case 'qubits':
        return <BlochSphereView onNavigateToConcepts={() => setCurrentTab('concepts')} />;
      case 'gates':
        return <GatesView />;
      case 'circuits':
        return (
          <CircuitsView
            onLoadAndSimulate={() => {
              setCurrentTab('simulate');
            }}
          />
        );
      case 'simulate':
        return <SimulateView isExplorerMode={isExplorerMode} />;
      case 'concepts':
      case 'learn':
        return (
          <ConceptsView
            onLoadPresetToSimulator={() => {
              setCurrentTab('simulate');
            }}
          />
        );
      case 'problems':
        return <ProblemsView />;
      case 'visualizations':
      case 'explore':
        return (
          <VisualizationsView
            onNavigateToSimulator={() => {
              setCurrentTab('simulate');
            }}
          />
        );
      default:
        return <BlochSphereView onNavigateToConcepts={() => setCurrentTab('concepts')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#17211D] flex flex-col font-sans">
      {/* Top Application Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        isExplorerMode={isExplorerMode}
        onToggleExplorerMode={handleToggleExplorerMode}
      />

      {/* Main Body with Sidebar + Active View Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={tab => setCurrentTab(tab)} />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;
