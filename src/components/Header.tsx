import React from 'react';

interface HeaderProps {
  predefinedStacksCount: number;
}

export default function Header({ predefinedStacksCount }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-6 py-3 bg-[#18181B] text-white border-b border-[#27272A]" id="site-header">
      <div className="flex items-center gap-3 py-1">
        <div className="w-8 h-8 bg-blue-600 flex items-center justify-center font-black text-white italic rounded-sm shadow-sm" id="brand-logo">W</div>
        <div className="flex flex-col">
          <h1 className="text-base md:text-lg font-black tracking-tight uppercase flex items-center gap-2">
            Web Architecture Decision Matrix <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">v3.5</span>
          </h1>
          <span className="text-xs text-gray-400 font-mono mt-0.5">Precision System Configuration Blueprint</span>
        </div>
      </div>

      {/* STATS OVERVIEW HEADER RAIL */}
      <div className="flex items-center gap-4 text-xs font-mono border-t md:border-t-0 border-gray-800 pt-2 md:pt-0 mt-2 md:mt-0" id="header-counters">
        <div className="flex flex-col pr-3 border-r border-[#27272A]">
          <span className="uppercase text-gray-500 text-[10px] font-bold tracking-widest">Workspace Active</span>
          <span className="text-gray-200">PROD-AX-992</span>
        </div>
        <div className="flex flex-col pr-3 border-r border-[#27272A]">
          <span className="uppercase text-gray-500 text-[10px] font-bold tracking-widest">Total Stacks</span>
          <span className="text-gray-200">{predefinedStacksCount} Preconfigured</span>
        </div>
        <div className="flex flex-col">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            ONLINE COMPILER
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">SANDBOX READY</span>
        </div>
      </div>
    </header>
  );
}
