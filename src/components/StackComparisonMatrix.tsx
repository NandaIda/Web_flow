import React, { useState, useMemo } from 'react';
import { Search, Sliders } from 'lucide-react';
import { PREDEFINED_STACKS } from '../data';

interface StackComparisonMatrixProps {
  setStepChoices: (choices: Record<number, string>) => void;
  setActiveTab: (tab: 'flow' | 'table' | 'graphs' | 'builder') => void;
  handleCopyClipboard: (text: string) => void;
}

export default function StackComparisonMatrix({
  setStepChoices,
  setActiveTab,
  handleCopyClipboard
}: StackComparisonMatrixProps) {
  // Table Page state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterComplexity, setFilterComplexity] = useState<string>('All');
  const [filterDb, setFilterDb] = useState<string>('All');
  const [selectedStackId, setSelectedStackId] = useState<string | null>('pern');
  const [sortField, setSortField] = useState<'name' | 'complexity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered predefined stack rows
  const filteredAndSortedStacks = useMemo(() => {
    return PREDEFINED_STACKS.filter(stack => {
      const matchesSearch = stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            stack.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesComplexity = filterComplexity === 'All' || stack.complexity === filterComplexity;
      const matchesDb = filterDb === 'All' || stack.database.toLowerCase().includes(filterDb.toLowerCase());
      return matchesSearch && matchesComplexity && matchesDb;
    }).sort((a, b) => {
      const valA = sortField === 'name' ? a.name : a.complexity;
      const valB = sortField === 'name' ? b.name : b.complexity;
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchQuery, filterComplexity, filterDb, sortField, sortOrder]);

  const toggleSort = (field: 'name' | 'complexity') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const selectedStackDetail = useMemo(() => {
    return PREDEFINED_STACKS.find(s => s.id === selectedStackId) || PREDEFINED_STACKS[0];
  }, [selectedStackId]);

  return (
    <div className="flex flex-col gap-6" id="tab-table-content">
      
      {/* SEARCH AND FILTERS CARD */}
      <div className="bg-white border border-[#D4D4D8] p-4 rounded shadow-sm flex flex-col md:flex-row items-center gap-4 py-3" id="table-filters-card">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Query preconfigured stacks (e.g. PERN, Django, Ruby)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#F4F4F5] placeholder-gray-500 text-gray-950 pl-9 pr-4 py-2 border border-[#D4D4D8] focus:outline-hidden focus:border-blue-500 rounded-sm"
            id="input-table-search"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Complexity:</span>
            <select
              value={filterComplexity}
              onChange={(e) => setFilterComplexity(e.target.value)}
              className="text-xs bg-white text-[#18181B] px-2 py-1.5 border border-[#D4D4D8] rounded-sm focus:outline-hidden"
              id="select-complexity"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Database:</span>
            <select
              value={filterDb}
              onChange={(e) => setFilterDb(e.target.value)}
              className="text-xs bg-white text-[#18181B] px-2 py-1.5 border border-[#D4D4D8] rounded-sm focus:outline-hidden"
              id="select-database"
            >
              <option value="All">All Databases</option>
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MySQL">MySQL</option>
              <option value="SQLite">SQLite</option>
            </select>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID: COMPARATOR LIST & ACTIVE DETAIL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* STACK GRID TABLE LIST (LEFT COLS) */}
        <div className="lg:col-span-8 bg-white border border-[#D4D4D8] rounded shadow-sm overflow-hidden" id="table-grid-list">
          
          {/* GRID HEADER */}
          <div className="grid grid-cols-[60px_160px_1fr_130px_100px] bg-[#EBEBEB] border-b border-[#D4D4D8] py-2 px-3 font-mono font-bold text-[10px] text-gray-600 uppercase">
            <div className="flex items-center gap-1 cursor-pointer hover:text-black" onClick={() => toggleSort('name')}>
              Rank {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
            </div>
            <div>Backend Engine</div>
            <div>Primary Composition</div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-black" onClick={() => toggleSort('complexity')}>
              Complexity {sortField === 'complexity' && (sortOrder === 'asc' ? '▲' : '▼')}
            </div>
            <div className="text-right">Action</div>
          </div>

          {/* TABLE ROWS */}
          <div className="divide-y divide-[#D4D4D8]/70 max-h-[480px] overflow-y-auto">
            {filteredAndSortedStacks.length > 0 ? (
              filteredAndSortedStacks.map((stack, idx) => {
                const isChosen = selectedStackId === stack.id;
                return (
                  <div
                    key={stack.id}
                    id={`row-stack-${stack.id}`}
                    onClick={() => setSelectedStackId(stack.id)}
                    className={`grid grid-cols-[60px_160px_1fr_130px_100px] items-center py-3.5 px-3 cursor-pointer transition-all ${
                      isChosen
                        ? 'bg-blue-50/70 border-l-4 border-blue-600 text-black font-semibold'
                        : 'hover:bg-blue-50/40 text-[#27272A] ' + (idx % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white')
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-gray-500">#{idx + 1}</span>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-gray-900">{stack.backend}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{stack.api}</span>
                    </div>

                    <div className="flex flex-col pr-4">
                      <span className="text-xs truncate font-medium text-gray-900">{stack.name}</span>
                      <span className="text-[10px] text-gray-500 truncate">{stack.frontend} + {stack.styles}</span>
                    </div>

                    <div>
                      <span className={`inline-flex text-[9px] font-semibold px-2 py-0.5 rounded font-mono ${
                        stack.complexity === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : stack.complexity === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stack.complexity}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-blue-600 font-bold hover:underline">Select Block</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs">
                No preconfigured architecture paths matches your active select criteria.
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE FULL SPECS DETAILS PANEL (RIGHT COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-4" id="details-panel-panel">
          <div className="bg-[#EBEBEB] border border-[#D4D4D8] p-5 rounded shadow-sm flex flex-col justify-between h-full">
            <div>
              <h3 className="text-[10px] font-bold text-blue-650 uppercase tracking-widest font-mono mb-1.5">
                Spec Details
              </h3>
              <h2 className="text-base font-black text-gray-900 leading-tight mb-2">
                {selectedStackDetail.name}
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {selectedStackDetail.description}
              </p>

              <div className="p-3.5 bg-white border border-[#D4D4D8] rounded-sm flex flex-col gap-2 mb-4 shadow-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">Database Selection:</span>
                  <span className="font-mono font-bold text-[#18181B]">{selectedStackDetail.database}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">Db layer:</span>
                  <span className="font-mono font-bold text-[#18181B]">{selectedStackDetail.dbAccess}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">Runtime Orchestrator:</span>
                  <span className="font-mono font-bold text-[#18181B]">{selectedStackDetail.runtimeProcess}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">Ingress Reverse Proxy:</span>
                  <span className="font-mono font-bold text-[#18181B]">{selectedStackDetail.proxy}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">Telemetry Suite:</span>
                  <span className="font-mono font-bold text-[#18181B]">{selectedStackDetail.monitoring}</span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 border-l-4 border-blue-600 rounded-sm">
                <h4 className="text-[10px] font-bold text-blue-750 uppercase mb-1">Ideal Scenario Mapping</h4>
                <p className="text-[11px] text-blue-900 leading-relaxed">
                  {selectedStackDetail.idealUse}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D4D4D8] mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  // Apply Selected Stack as choices in the Step Matrix!
                  setStepChoices({
                    1: selectedStackDetail.frontend.toLowerCase().includes('react') ? 'react' : selectedStackDetail.frontend.toLowerCase().includes('vue') ? 'vue' : selectedStackDetail.frontend.toLowerCase().includes('svelte') ? 'svelte' : 'html5',
                    2: 'vite',
                    3: selectedStackDetail.styles.toLowerCase().includes('tailwind') ? 'tailwind' : 'css-modules',
                    4: selectedStackDetail.api.toLowerCase().includes('rest') ? 'rest' : 'websockets',
                    5: selectedStackDetail.backend.toLowerCase().includes('node') ? 'node-ts' : selectedStackDetail.backend.toLowerCase().includes('django') ? 'python' : selectedStackDetail.backend.toLowerCase().includes('fastapi') ? 'python' : selectedStackDetail.backend.toLowerCase().includes('laravel') ? 'php' : 'rust',
                    6: selectedStackDetail.backend.toLowerCase().includes('express') ? 'express' : selectedStackDetail.backend.toLowerCase().includes('django') ? 'django' : selectedStackDetail.backend.toLowerCase().includes('fastapi') ? 'fastapi' : selectedStackDetail.backend.toLowerCase().includes('laravel') ? 'laravel' : 'axum',
                    7: selectedStackDetail.dbAccess.toLowerCase().includes('prisma') ? 'orm' : 'query-builder',
                    8: selectedStackDetail.database.toLowerCase().includes('postgres') ? 'postgres' : selectedStackDetail.database.toLowerCase().includes('mysql') ? 'mysql' : 'sqlite',
                    9: 'sessions',
                    10: selectedStackDetail.deployment.toLowerCase().includes('render') ? 'paas' : 'vps',
                    11: selectedStackDetail.runtimeProcess.toLowerCase().includes('pm2') ? 'pm2' : 'systemd',
                    12: selectedStackDetail.proxy.toLowerCase().includes('nginx') ? 'nginx' : 'caddy',
                    13: selectedStackDetail.monitoring.toLowerCase().includes('sentry') ? 'sentry' : 'pm2-logs'
                  });
                  alert(`Config matches loaded for ${selectedStackDetail.name}!`);
                  setActiveTab('flow');
                }}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold uppercase text-xs tracking-wider py-2 rounded shadow-sm text-center"
                id="btn-apply-comparison-blueprint"
              >
                Port Specs to Interactive Flow
              </button>
              <button
                onClick={() => handleCopyClipboard(`=== PRECONFIGURED BLUEPRINT: ${selectedStackDetail.name} ===\n\nSpecs list:\n- Frontend: ${selectedStackDetail.frontend}\n- Styling: ${selectedStackDetail.styles}\n- Backend: ${selectedStackDetail.backend}\n- API paradigm: ${selectedStackDetail.api}\n- Database selection: ${selectedStackDetail.database}\n- Db utility layer: ${selectedStackDetail.dbAccess}\n- Process manager: ${selectedStackDetail.runtimeProcess}\n- Proxy controller: ${selectedStackDetail.proxy}\n- Telemetry client: ${selectedStackDetail.monitoring}\n\nIdeal For: ${selectedStackDetail.idealUse}`)}
                className="w-full bg-[#18181B] text-white hover:bg-black font-semibold uppercase text-xs tracking-wider py-2 rounded transition-all text-center"
                id="btn-copy-blueprint-table"
              >
                Export Spec Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
