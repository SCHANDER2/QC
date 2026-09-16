import React from 'react';
import { Atom, Compass } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isExplorerMode: boolean;
  onToggleExplorerMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isExplorerMode,
  onToggleExplorerMode,
}) => {
  const tabs = [
    { id: 'learn', label: 'Learn' },
    { id: 'simulate', label: 'Simulate' },
    { id: 'concepts', label: 'Concepts' },
    { id: 'problems', label: 'Problems' },
    { id: 'visualizations', label: 'Explore' },
  ];

  return (
    <header className="h-16 bg-[#FFFDF8] border-b border-border px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand Logo */}
      <div
        className="flex items-center space-x-2.5 cursor-pointer"
        onClick={() => onSelectTab('home')}
      >
        <div className="w-8 h-8 rounded-full bg-soft-green flex items-center justify-center text-primary-green border border-[#C3D7CA]">
          <Atom className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl font-bold tracking-tight text-dark-text font-serif">
            Quantum<span className="text-primary-green">Learn</span>
          </span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="hidden md:flex items-center space-x-1">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-soft-green text-primary-green font-semibold shadow-xs'
                  : 'text-muted-text hover:text-dark-text hover:bg-background'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Mode Toggle, Search, Avatar */}
      <div className="flex items-center space-x-4">
        {/* Beginner vs Explorer Depth Switch */}
        <button
          onClick={onToggleExplorerMode}
          className="flex items-center space-x-1.5 px-3 py-1 text-xs rounded-full border border-border bg-surface hover:bg-background transition-colors"
          title="Toggle between guided Beginner Mode and advanced Explorer Mode"
        >
          <Compass className="w-3.5 h-3.5 text-primary-green" />
          <span className="text-muted-text">Mode:</span>
          <span className="font-semibold text-dark-text">
            {isExplorerMode ? 'Explorer' : 'Beginner'}
          </span>
        </button>

        <div className="hidden lg:flex items-center text-xs text-muted-text italic">
          Learn today. Build tomorrow.
        </div>

        {/* User Pill */}
        <div
          className="w-8 h-8 rounded-full bg-soft-green text-primary-green border border-[#C3D7CA] flex items-center justify-center font-mono font-bold text-xs shadow-xs cursor-pointer"
          title="Academic Laboratory Student Profile"
        >
          LB
        </div>
      </div>
    </header>
  );
};
