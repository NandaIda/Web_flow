import React, { useState } from 'react';
import { Activity, ArrowDown, ChevronRight, Globe, Database, Terminal } from 'lucide-react';

interface VisualTopologyNodesProps {
  setActiveTab: (tab: 'flow' | 'table' | 'graphs' | 'builder') => void;
}

type GraphType = 'full' | 'learning' | 'backend' | 'frontend' | 'database' | 'deployment';

export default function VisualTopologyNodes({ setActiveTab }: VisualTopologyNodesProps) {
  const [activeGraph, setActiveGraph] = useState<GraphType>('learning');

  return (
    <div className="flex flex-col gap-6" id="tab-graphs-content">
      
      {/* GRAPHS ACTIVE MAP SELECT BAR */}
      <div className="bg-white border border-[#D4D4D8] p-3 rounded shadow-sm flex flex-wrap items-center gap-2 justify-between" id="graphs-select-bar">
        <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider font-mono px-2">Active Network Node Layer:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'learning', label: 'Learning Path Chart' },
            { id: 'backend', label: 'Backend Architecture Flow' },
            { id: 'database', label: 'Database Transmit Path' },
            { id: 'deployment', label: 'Operational Deployment Chain' },
            { id: 'full', label: 'Global Infrastructure Map' }
          ].map((graph) => (
            <button
              key={graph.id}
              onClick={() => setActiveGraph(graph.id as GraphType)}
              id={`btn-graph-${graph.id}`}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all border rounded-xs ${
                activeGraph === graph.id
                  ? 'bg-[#18181B] text-white border-black font-bold'
                  : 'bg-[#F4F4F5] text-gray-650 hover:bg-[#EBEBEB] border-transparent'
              }`}
            >
              {graph.label}
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE DIAGRAM BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CANVAS BOX GRAPHICS PANEL (LEFT COLS) */}
        <div className="lg:col-span-8 bg-white border border-[#D4D4D8] rounded shadow-sm p-6 relative flex flex-col items-center justify-center min-h-[460px] overflow-hidden" id="interactive-canvas">
          <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[9px] text-gray-400">
            <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
            <span>Interactive Real-time Graph Visualizer Node Engine</span>
          </div>

          {/* GRAPH 1: LEARNING PATH */}
          {activeGraph === 'learning' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-[500px]" id="learning-chart">
              <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded text-center w-full shadow-sm hover:scale-102 transition-transform duration-200">
                <span className="text-[10px] uppercase font-mono text-emerald-600 font-bold">Phase 1: Foundation</span>
                <h4 className="text-sm font-black text-gray-900 mt-1">Plain JavaScript + DOM Operations</h4>
              </div>
              <ArrowDown className="text-gray-400" />
              <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded text-center w-full shadow-sm hover:scale-102 transition-transform duration-200">
                <span className="text-[10px] uppercase font-mono text-blue-600 font-bold">Phase 2: UI Library</span>
                <h4 className="text-sm font-black text-gray-900 mt-1">TypeScript React + Vite Packaging</h4>
              </div>
              <ArrowDown className="text-gray-400" />
              <div className="p-4 bg-[#18181B] text-white border-2 border-slate-900 rounded text-center w-full shadow-sm hover:scale-102 transition-transform duration-200">
                <span className="text-[10px] uppercase font-mono text-gray-400 font-bold">Phase 3: Production Deployment</span>
                <h4 className="text-sm font-bold mt-1">Server API routes + Daemon Process PM2</h4>
              </div>
            </div>
          )}

          {/* GRAPH 2: BACKEND ARCHITECTURE FLOW */}
          {activeGraph === 'backend' && (
            <div className="grid grid-cols-3 gap-3 items-center w-full max-w-[580px]" id="backend-flow-chart">
              <div className="bg-white p-3.5 border border-[#D4D4D8] rounded shadow-xs relative text-center">
                <span className="text-[8px] uppercase font-mono text-gray-400">Consumer Client</span>
                <h5 className="text-xs font-bold text-gray-900 mt-1">React Web UI</h5>
                <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-400"></div>
              </div>
              <div className="bg-[#18181B] text-white p-3.5 border border-slate-900 rounded text-center relative shadow-sm">
                <span className="text-[8px] uppercase font-mono text-blue-400">API Gateway Proxy</span>
                <h5 className="text-xs font-bold mt-1">Nginx Routing Server</h5>
                <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-4 h-0.5 bg-gray-400"></div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-600 p-3.5 rounded text-center shadow-xs">
                <span className="text-[8px] uppercase font-mono text-blue-700">Compute Layer</span>
                <h5 className="text-xs font-black text-gray-900 mt-1">Express API Process</h5>
              </div>
            </div>
          )}

          {/* GRAPH 3: DATABASE TRANSMIT PATH */}
          {activeGraph === 'database' && (
            <div className="flex flex-col items-center gap-5 w-full max-w-[420px]" id="database-transmit-chart">
              <div className="p-3.5 bg-white border border-[#D4D4D8] rounded text-center w-full shadow-xs">
                <Globe className="h-5 w-5 text-gray-500 mx-auto" />
                <h5 className="text-xs font-bold text-gray-900 mt-1.5">Node.js ORM Query Engine</h5>
              </div>
              <div className="h-8 w-0.5 bg-dashed border-l-2 border-[#D4D4D8]"></div>
              <div className="p-4 bg-emerald-50 border-2 border-emerald-600 rounded text-center w-full shadow-sm">
                <Database className="h-5 w-5 text-emerald-600 mx-auto" />
                <h5 className="text-xs font-black text-gray-900 mt-1.5">PostgreSQL Database Node</h5>
                <p className="text-[10px] text-gray-500 mt-1">Strict Relational ACID compliance transactional safety</p>
              </div>
            </div>
          )}

          {/* GRAPH 4: OPERATIONAL DEPLOYMENT CHAIN */}
          {activeGraph === 'deployment' && (
            <div className="flex items-center gap-3 w-full justify-center max-w-[620px]" id="deployment-pipeline">
              <div className="bg-[#EBEBEB] p-3 text-center border border-[#D4D4D8] rounded">
                <p className="text-[9px] font-mono text-gray-500 uppercase">Git repo</p>
                <h6 className="text-xs font-bold text-gray-800">Github Origin</h6>
              </div>
              <ChevronRight className="text-gray-400 shrink-0" />
              <div className="bg-blue-50 border-2 border-blue-500 p-3 text-center rounded">
                <p className="text-[9px] font-mono text-blue-600 uppercase">Deploy builder</p>
                <h6 className="text-xs font-black text-gray-900">Vite Minify Compiler</h6>
              </div>
              <ChevronRight className="text-gray-400 shrink-0" />
              <div className="bg-white p-3 text-center border border-[#D4D4D8] rounded">
                <p className="text-[9px] font-mono text-gray-500 uppercase">Supervisor</p>
                <h6 className="text-xs font-bold text-gray-800">Linux Daemon PM2</h6>
              </div>
              <ChevronRight className="text-gray-400 shrink-0" />
              <div className="bg-[#18181B] text-white p-3 text-center rounded shadow-sm">
                <p className="text-[9px] font-mono text-gray-400 uppercase">Public Ingress</p>
                <h6 className="text-xs font-bold">Nginx Reverse Gateway</h6>
              </div>
            </div>
          )}

          {/* GRAPH 5: FULL GLOBAL INFRASTRUCTURE MAP */}
          {activeGraph === 'full' && (
            <div className="p-4 bg-white border border-[#D4D4D8] rounded-sm w-full font-mono text-[11px] leading-relaxed max-w-[500px]" id="full-map-canvas">
              <div className="text-blue-600 font-bold mb-2">PUBLIC WEB ROUTING SPECIFICATION</div>
              <div className="text-gray-500">
                [Browser Engine] → [HTTPS Gate Cloudflare 443]<br/>
                &nbsp;&nbsp;↳ [Linux Reverse proxy Gate Caddy]<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ [Internal port forwarding map localhost:3000]<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ [Express JS server framework process daemon]<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ [SQL Schema Transactional connection pool]<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ [PostgreSQL Container Data segment]
              </div>
            </div>
          )}
        </div>

        {/* GRAPHS ACTIVE SUMMARY TIPS (RIGHT COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-4" id="graphs-explain-panel">
          <div className="bg-[#EBEBEB] border border-[#D4D4D8] p-5 rounded shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-bold text-blue-650 uppercase tracking-widest font-mono mb-2">
                Operational Philosophy
              </h3>
              <h2 className="text-base font-black text-gray-900 leading-tight mb-3">
                Structural Connections
              </h2>
              
              <div className="space-y-4 text-xs text-gray-600 leading-relaxed">
                <p>
                  This visual mapper isolates the discrete transitions of network packets and source compilation milestones as they transit from development to production.
                </p>
                <p>
                  Modern full-stack architectures decouple the presentation layer from transaction handlers to assure safe horizontal scalability across cloud platform engines.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#D4D4D8] rounded-sm mt-5">
                <div className="text-xs font-mono font-bold text-gray-900 flex items-center gap-1.5 mb-1.5">
                  <Terminal className="h-4 w-4 text-gray-600" /> System Topology Rules
                </div>
                <ul className="list-disc pl-4 text-[11px] text-gray-600 space-y-1">
                  <li>Port 3000 mapped internally</li>
                  <li>Automated SSL redirection (443 to 80)</li>
                  <li>Database queries limited to local socket</li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => setActiveTab('flow')}
                className="w-full bg-[#18181B] text-white hover:bg-black font-semibold uppercase text-xs tracking-wider py-2.5 rounded transition-all text-center"
                id="btn-return-flow-from-graph"
              >
                Return to Interactive Matrix
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
