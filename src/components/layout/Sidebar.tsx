import React from 'react';
import {
  Home,
  Activity,
  Grid,
  GitBranch,
  PlaySquare,
  BookOpen,
  FileQuestion,
  BarChart3,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'qubits', label: 'Qubits', icon: Activity },
    { id: 'gates', label: 'Quantum Gates', icon: Grid },
    { id: 'circuits', label: 'Circuits', icon: GitBranch },
    { id: 'simulate', label: 'Simulations', icon: PlaySquare },
    { id: 'concepts', label: 'Concepts', icon: BookOpen },
    { id: 'problems', label: 'Problems', icon: FileQuestion },
    { id: 'visualizations', label: 'Visualizations', icon: BarChart3 },
  ];

  return (
    <aside className="w-56 bg-[#FFFDF8] border-r border-border flex flex-col justify-between p-4 flex-shrink-0 select-none min-h-[calc(100vh-4rem)]">
      {/* Navigation List */}
      <div className="space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-soft-green text-primary-green font-semibold'
                  : 'text-muted-text hover:text-dark-text hover:bg-background'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary-green' : 'text-muted-text'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Inspiration Note */}
      <div className="pt-4 border-t border-border/60">
        <div className="flex items-center space-x-2 text-primary-green mb-1">
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-semibold">Small concepts.</span>
        </div>
        <p className="text-[11px] text-muted-text pl-6">
          Big possibilities.
        </p>
      </div>
    </aside>
  );
};
