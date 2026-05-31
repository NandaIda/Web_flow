import React from 'react';
import { Layers, Sliders, Compass, Sparkles } from 'lucide-react';

type TabType = 'flow' | 'table' | 'graphs' | 'builder';

interface TabsNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function TabsNavigation({ activeTab, setActiveTab }: TabsNavigationProps) {
  return (
    <nav className="bg-white border-b border-[#D4D4D8] px-6 py-2 flex items-center gap-4 overflow-x-auto scrollbar-none" id="tabs-navigation">
      <button
        onClick={() => setActiveTab('flow')}
        id="btn-tab-flow"
        className={`flex items-center gap-2 px-4 py-2.5 text-sm md:text-base font-bold uppercase transition-all tracking-wider border-b-2 ${
          activeTab === 'flow'
            ? 'border-blue-600 text-blue-600 font-black'
            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-[#D4D4D8]'
        }`}
      >
        <Layers className="h-5 w-5" /> Stack Builder
      </button>
      <button
        onClick={() => setActiveTab('table')}
        id="btn-tab-table"
        className={`flex items-center gap-2 px-4 py-2.5 text-sm md:text-base font-bold uppercase transition-all tracking-wider border-b-2 ${
          activeTab === 'table'
            ? 'border-blue-600 text-blue-600 font-black'
            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-[#D4D4D8]'
        }`}
      >
        <Sliders className="h-5 w-5" /> Stack Comparison Matrix
      </button>
      <button
        onClick={() => setActiveTab('graphs')}
        id="btn-tab-graphs"
        className={`flex items-center gap-2 px-4 py-2.5 text-sm md:text-base font-bold uppercase transition-all tracking-wider border-b-2 ${
          activeTab === 'graphs'
            ? 'border-blue-600 text-blue-600 font-black'
            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-[#D4D4D8]'
        }`}
      >
        <Compass className="h-5 w-5" /> Visual Topology Nodes
      </button>
      <button
        onClick={() => setActiveTab('builder')}
        id="btn-tab-builder"
        className={`flex items-center gap-2 px-4 py-2.5 text-sm md:text-base font-bold uppercase transition-all tracking-wider border-b-2 ${
          activeTab === 'builder'
            ? 'border-blue-600 text-blue-600 font-black'
            : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-[#D4D4D8]'
        }`}
      >
        <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" /> Vibecoder Smart Advisor
      </button>
    </nav>
  );
}
