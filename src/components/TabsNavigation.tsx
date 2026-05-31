import React from 'react';
import { Layers, Map, Sparkles, BookOpen } from 'lucide-react';

export type TabType = 'flow' | 'graphs' | 'builder' | 'learn';

interface TabsNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS = [
  {
    id: 'flow' as TabType,
    label: 'Stack Builder',
    sublabel: 'Design your stack',
    icon: Layers,
  },
  {
    id: 'graphs' as TabType,
    label: 'Visual Map',
    sublabel: 'Diagram + ecosystem',
    icon: Map,
  },
  {
    id: 'builder' as TabType,
    label: 'Vibecoder',
    sublabel: 'AI prompt + polish',
    icon: Sparkles,
  },
  {
    id: 'learn' as TabType,
    label: 'Read More',
    sublabel: 'Knowledge & compare',
    icon: BookOpen,
  },
];

export default function TabsNavigation({ activeTab, setActiveTab }: TabsNavigationProps) {
  return (
    <nav
      className="bg-white border-b border-[#D4D4D8] px-4 flex items-end gap-1 overflow-x-auto scrollbar-none"
      id="tabs-navigation"
    >
      {TABS.map(tab => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            id={`btn-tab-${tab.id}`}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
              active
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
            <div className="flex flex-col items-start">
              <span className={`text-sm font-black leading-tight ${active ? 'text-blue-700' : ''}`}>
                {tab.label}
              </span>
              <span className="text-xs text-gray-400 leading-tight hidden sm:block">
                {tab.sublabel}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
