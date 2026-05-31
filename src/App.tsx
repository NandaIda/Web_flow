import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  Terminal,
  Database,
  Globe,
  Settings,
  HelpCircle,
  Code,
  CheckCircle2,
  Copy,
  Sliders,
  Compass,
  FileCode,
  ArrowUpDown,
  Cpu,
  Bookmark,
  Share2,
  Info,
  ExternalLink,
  Eye,
  Activity,
  Check,
  Zap,
  BookOpen,
  ArrowDown
} from 'lucide-react';

import {
  StackItem,
  PREDEFINED_STACKS,
  DecisionStep,
  DECISION_STEPS
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<'flow' | 'table' | 'graphs' | 'builder'>('flow');

  // Interactive 13 Step Builder state
  const [stepChoices, setStepChoices] = useState<Record<number, string>>({
    1: 'react',
    2: 'vite',
    3: 'tailwind',
    4: 'rest',
    5: 'node-ts',
    6: 'express',
    7: 'orm',
    8: 'postgres',
    9: 'sessions',
    10: 'paas',
    11: 'pm2',
    12: 'nginx',
    13: 'sentry'
  });
  const [currentStepperIndex, setCurrentStepperIndex] = useState<number>(0);

  // Table Page state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterComplexity, setFilterComplexity] = useState<string>('All');
  const [filterDb, setFilterDb] = useState<string>('All');
  const [selectedStackId, setSelectedStackId] = useState<string | null>('pern');
  const [sortField, setSortField] = useState<'name' | 'complexity'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Visualization Graphs state
  const [activeGraph, setActiveGraph] = useState<
    'full' | 'learning' | 'backend' | 'frontend' | 'database' | 'deployment'
  >('learning');
  const [graphHoverNode, setGraphHoverNode] = useState<string | null>(null);

  // Custom Stack wizard questionnaire state
  const [wizardAnswers, setWizardAnswers] = useState({
    appName: 'Acme Enterprise Node',
    appType: 'saas', // saas, realtime, blog, dashboard, internal
    teamExp: 'js-ts', // js-ts, python, performance, traditional, rapid
    hostingGoal: 'hobby', // hobby, cloud-scale, secure-vps
    stylePrefer: 'tailwind', // tailwind, modular, rapid
  });
  const [generatedCustomStack, setGeneratedCustomStack] = useState<StackItem | null>(null);

  // Dynamic configuration helper for Wizard Result
  useEffect(() => {
    let recommendedId = 'pern';
    
    if (wizardAnswers.teamExp === 'python') {
      recommendedId = wizardAnswers.appType === 'dashboard' ? 'fastapi-react' : 'django-react';
    } else if (wizardAnswers.teamExp === 'performance') {
      recommendedId = 'go-backend';
    } else if (wizardAnswers.teamExp === 'traditional') {
      recommendedId = 'php-laravel';
    } else if (wizardAnswers.appType === 'blog' || wizardAnswers.appType === 'saas') {
      recommendedId = 'nextjs-fullstack';
    } else {
      recommendedId = 'pern';
    }

    const matched = PREDEFINED_STACKS.find(s => s.id === recommendedId) || PREDEFINED_STACKS[0];
    setGeneratedCustomStack(matched);
  }, [wizardAnswers]);

  // Handle choice update in active 13 Steps Flow
  const handleStepChoiceSelect = (step: number, choiceId: string) => {
    setStepChoices(prev => {
      const updated = { ...prev, [step]: choiceId };
      
      // Auto adjusting realistic sub-choices for ease of use
      if (step === 1) { // Frontend Choice
        if (choiceId === 'angular') {
          updated[2] = 'angular-cli';
          updated[3] = 'bootstrap';
        } else if (choiceId === 'html5') {
          updated[2] = 'none';
        } else {
          updated[2] = 'vite';
        }
      } else if (step === 5) { // Backend Language Choice
        if (choiceId === 'python') {
          updated[6] = 'fastapi';
          updated[7] = 'orm';
          updated[11] = 'systemd';
        } else if (choiceId === 'go') {
          updated[6] = 'express'; // fallback or none
          updated[11] = 'systemd';
        } else if (choiceId === 'rust') {
          updated[6] = 'axum';
          updated[7] = 'query-builder';
          updated[11] = 'systemd';
        } else if (choiceId === 'php') {
          updated[6] = 'laravel';
          updated[7] = 'orm';
          updated[11] = 'systemd';
        } else {
          updated[6] = 'express';
          updated[11] = 'pm2';
        }
      }
      return updated;
    });
  };

  const getStepOptionSelectedData = (stepNum: number) => {
    const activeStep = DECISION_STEPS.find(s => s.step === stepNum);
    if (!activeStep) return null;
    const choiceKey = stepChoices[stepNum];
    return activeStep.options.find(o => o.id === choiceKey) || activeStep.options[0];
  };

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Architecture blueprint configuration copied to your clipboard!");
  };

  // Memoized stats rating based on chosen parameters
  const calculatedStats = useMemo(() => {
    let totalScore = 0;
    let containsRelational = false;
    let containsNode = false;
    let isHeavy = false;

    Object.keys(stepChoices).forEach((stepKey) => {
      const stepNum = parseInt(stepKey);
      const val = stepChoices[stepNum];
      const activeStep = DECISION_STEPS.find(s => s.step === stepNum);
      const choice = activeStep?.options.find(o => o.id === val);
      if (choice) {
        totalScore += choice.popularity;
      }
      if (['postgres', 'mysql'].includes(val)) containsRelational = true;
      if (val === 'node-ts' || val === 'express') containsNode = true;
      if (['hyper-cloud', 'systemd', 'prometheus-grafana', 'rust', 'angular'].includes(val)) isHeavy = true;
    });

    let complexity = 'Medium';
    if (totalScore > 850) complexity = 'Enterprise Scope';
    else if (totalScore < 500) complexity = 'Low / Startup MVP';

    const costLevel = isHeavy ? '$$$ Industrial Premium' : containsNode ? '$$ Modest Developer' : '$ Lean Hobbyist';
    
    return {
      complexity,
      costLevel,
      databaseType: containsRelational ? 'ACID SQL Relational' : 'NoSQL Serverless',
      languageVibe: containsNode ? 'Single-Language JS/TS' : 'Multi-Language Runtimes'
    };
  }, [stepChoices]);

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
    <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] flex flex-col font-sans selection:bg-blue-600 selection:text-white" id="root-container">
      
      {/* HIGH DENSITY HEADER */}
      <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between px-6 py-3 bg-[#18181B] text-white border-b border-[#27272A]" id="site-header">
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center font-black text-white italic rounded-sm shadow-sm" id="brand-logo">W</div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight uppercase flex items-center gap-2">
              Web Architecture Decision Matrix <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded border border-blue-500/30">v3.5</span>
            </h1>
            <span className="text-[10px] text-gray-400 font-mono">Precision System Configuration Blueprint</span>
          </div>
        </div>

        {/* STATS OVERVIEW HEADER RAIL */}
        <div className="flex items-center gap-4 text-[11px] font-mono border-t md:border-t-0 border-gray-800 pt-2 md:pt-0 mt-2 md:mt-0" id="header-counters">
          <div className="flex flex-col pr-3 border-r border-[#27272A]">
            <span className="uppercase text-gray-500 text-[9px] font-bold">Workspace Active</span>
            <span className="text-gray-200">PROD-AX-992</span>
          </div>
          <div className="flex flex-col pr-3 border-r border-[#27272A]">
            <span className="uppercase text-gray-500 text-[9px] font-bold">Total Stacks Listed</span>
            <span className="text-gray-200">{PREDEFINED_STACKS.length} Preconfigured</span>
          </div>
          <div className="flex flex-col">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              ONLINE COMPILER
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">SANDBOX READY</span>
          </div>
        </div>
      </header>

      {/* COHESIVE TAB SWITCHER BAR */}
      <nav className="bg-white border-b border-[#D4D4D8] px-6 py-1 flex items-center gap-2 overflow-x-auto scrollbar-none" id="tabs-navigation">
        <button
          onClick={() => setActiveTab('flow')}
          id="btn-tab-flow"
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase transition-all tracking-wider border-b-2 ${
            activeTab === 'flow'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-[#D4D4D8]'
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> 13-Step Matrix Flow
        </button>
        <button
          onClick={() => setActiveTab('table')}
          id="btn-tab-table"
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase transition-all tracking-wider border-b-2 ${
            activeTab === 'table'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-[#D4D4D8]'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" /> Stack Comparison Matrix
        </button>
        <button
          onClick={() => setActiveTab('graphs')}
          id="btn-tab-graphs"
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase transition-all tracking-wider border-b-2 ${
            activeTab === 'graphs'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-[#D4D4D8]'
          }`}
        >
          <Compass className="h-3.5 w-3.5" /> Visual Topology Nodes
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          id="btn-tab-builder"
          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase transition-all tracking-wider border-b-2 ${
            activeTab === 'builder'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-[#D4D4D8]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" /> Auto-Stack Questionnaire
        </button>
      </nav>

      {/* PRIMARY GRID LAYOUT CONTAINER */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto" id="main-content-layout">

        {/* TAB 1: 13-STEP MATRIX FLOW */}
        {activeTab === 'flow' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="tab-flow-content">
            
            {/* STEP CHOOSER CARD (LEFT COLS) */}
            <div className="lg:col-span-8 flex flex-col gap-4" id="flow-card-panel">
              
              {/* INTERACTIVE STEPPING STEP INDICATOR */}
              <div className="bg-white border border-[#D4D4D8] p-4 flex flex-col gap-3 rounded-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Step {DECISION_STEPS[currentStepperIndex].step} of {DECISION_STEPS.length}
                  </h3>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    Active Module Setup
                  </span>
                </div>
                
                <h2 className="text-lg font-black tracking-tight text-gray-900">
                  {DECISION_STEPS[currentStepperIndex].title}
                </h2>
                <p className="text-xs text-gray-600">
                  {DECISION_STEPS[currentStepperIndex].subtitle}
                </p>

                {/* VISUAL DOT PROGRESS BAR */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
                  {DECISION_STEPS.map((step, idx) => {
                    const isSelected = idx === currentStepperIndex;
                    const isCompleted = stepChoices[step.step] !== undefined;
                    return (
                      <button
                        key={step.step}
                        onClick={() => setCurrentStepperIndex(idx)}
                        id={`step-dot-trigger-${step.step}`}
                        className={`text-[10px] font-mono h-6 px-2 rounded-sm flex items-center justify-center transition-all min-w-[32px] ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : isCompleted
                            ? 'bg-[#EBEBEB] text-[#18181B] hover:bg-[#D4D4D8]'
                            : 'bg-zinc-100 text-gray-400 hover:bg-zinc-200'
                        }`}
                        title={step.title}
                      >
                        {step.step}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE STEPPING OPTIONS LIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DECISION_STEPS[currentStepperIndex].options.map((opt) => {
                  const isSelected = stepChoices[DECISION_STEPS[currentStepperIndex].step] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleStepChoiceSelect(DECISION_STEPS[currentStepperIndex].step, opt.id)}
                      id={`option-${opt.id}`}
                      className={`cursor-pointer border-2 p-4 transition-all rounded-sm flex flex-col justify-between hover:shadow-md h-full select-none ${
                        isSelected
                          ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600/10'
                          : 'bg-white border-[#D4D4D8]/80 hover:border-gray-400'
                      }`}
                    >
                      <div>
                        {/* TAG LINE AND OPTION TITLE */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-sm tracking-tight text-gray-900 flex items-center gap-1.5">
                            {isSelected && <CheckCircle2 className="h-4.5 w-4.5 text-blue-600 shrink-0" />}
                            {opt.label}
                          </h3>
                          {opt.badge && (
                            <span className="text-[10px] bg-emerald-50 border border-emerald-300 text-emerald-700 px-1.5 py-0.2 rounded font-mono font-semibold">
                              {opt.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed mb-3">
                          {opt.desc}
                        </p>
                      </div>

                      {/* PROS AND CONS LIST */}
                      <div className="pt-3 border-t border-[#EBEBEB] mt-auto">
                        <div className="space-y-1">
                          {opt.pros.slice(0, 2).map((pro, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1 text-[10px] text-emerald-750">
                              <span className="text-emerald-500 font-bold shrink-0">✓</span>
                              <span>{pro}</span>
                            </div>
                          ))}
                          {opt.cons.slice(0, 1).map((con, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-1 text-[10px] text-red-750">
                              <span className="text-red-400 font-bold shrink-0">✗</span>
                              <span className="opacity-80">{con}</span>
                            </div>
                          ))}
                        </div>

                        {/* POPULARITY STATS BAR */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mt-3 pt-2 border-t border-zinc-100">
                          <span>Developer Share</span>
                          <span className="font-bold text-gray-700">{opt.popularity}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setCurrentStepperIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentStepperIndex === 0}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-[#D4D4D8] text-gray-700 hover:bg-gray-50 disabled:opacity-40 rounded-sm"
                  id="btn-flow-prev"
                >
                  Previous Step
                </button>
                
                {currentStepperIndex < DECISION_STEPS.length - 1 ? (
                  <button
                    onClick={() => setCurrentStepperIndex(prev => Math.min(DECISION_STEPS.length - 1, prev + 1))}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#18181B] text-white hover:bg-black rounded-sm flex items-center gap-1.5 shadow-sm"
                    id="btn-flow-next"
                  >
                    Next Step <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('table')}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 rounded-sm flex items-center gap-1.5 shadow-sm"
                    id="btn-flow-comp"
                  >
                    Compare Stack Results <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* HIGH-DENSITY NAVIGATION PROGRESS & ESTIMATOR RAIL (RIGHT COLS) */}
            <aside className="lg:col-span-4 border border-[#D4D4D8] bg-[#EBEBEB] p-5 rounded flex flex-col gap-5 self-start shadow-sm" id="progress-rail">
              <div>
                <h2 className="text-[11px] font-bold text-[#71717A] uppercase mb-1 tracking-widest">
                  Map Navigation Progress
                </h2>
                <div className="h-1 bg-gray-300 w-full rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${((Object.keys(stepChoices).length) / DECISION_STEPS.length) * 100}%` }}
                  />
                </div>

                {/* CURRENT CHOICES MINI-RAIL TEXT LIST */}
                <div className="space-y-1 max-h-[190px] overflow-y-auto pr-1">
                  {DECISION_STEPS.map((step) => {
                    const chosenId = stepChoices[step.step];
                    const matchedOpt = step.options.find(o => o.id === chosenId);
                    return (
                      <div 
                        key={step.step} 
                        onClick={() => setCurrentStepperIndex(step.step - 1)}
                        className={`cursor-pointer p-2 flex items-center justify-between text-[11px] transition-all border border-b border-transparent rounded-sm ${
                          step.step === currentStepperIndex + 1 
                            ? 'bg-white border-[#D4D4D8] font-bold text-blue-600 shadow-xs' 
                            : 'hover:bg-white/40'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] text-[#A1A1AA]">#{step.step}</span>
                          <span className="text-[#18181B] truncate max-w-[130px]">{step.title}</span>
                        </div>
                        <span className="font-mono font-semibold text-gray-600 text-[10px] whitespace-nowrap bg-zinc-100 px-1 py-0.2 rounded border border-zinc-200">
                          {matchedOpt ? matchedOpt.label.split(' ')[0] : 'None'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SYSTEM COMPLEXITY GAUGES */}
              <div className="p-4 bg-[#D4D4D8] rounded flex flex-col gap-2 shadow-sm" id="stats-overview-box">
                <div className="flex justify-between text-[11px] font-mono text-[#18181B] font-bold uppercase border-b border-[#A1A1AA]/30 pb-1.5">
                  <span className="flex items-center gap-1"><Cpu className="h-3.5 w-3.5 text-blue-600" /> Complexity Rating</span>
                  <span>{calculatedStats.complexity}</span>
                </div>
                
                <div className="h-1.5 w-full bg-[#A1A1AA] rounded-full overflow-hidden my-1">
                  <div 
                    className="h-full bg-[#18181B] transition-all duration-300" 
                    style={{ width: `${calculatedStats.complexity.includes('Enterprise') ? '90%' : calculatedStats.complexity.includes('Medium') ? '65%' : '35%'}` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2 font-mono text-[10px] text-gray-700">
                  <div className="flex flex-col">
                    <span className="uppercase text-[8px] text-[#71717A] tracking-wider font-bold">Estimated Cost</span>
                    <span className="text-[#18181B] font-semibold">{calculatedStats.costLevel}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="uppercase text-[8px] text-[#71717A] tracking-wider font-bold">DB Paradigm</span>
                    <span className="text-[#18181B] font-semibold truncate">{calculatedStats.databaseType}</span>
                  </div>
                </div>
                
                <div className="font-mono text-[10px] text-gray-700 border-t border-[#A1A1AA]/30 pt-2 flex flex-col">
                  <span className="uppercase text-[8px] text-[#71717A] tracking-wider font-bold">Language Vibe</span>
                  <span className="text-[#18181B] font-semibold">{calculatedStats.languageVibe}</span>
                </div>
              </div>

              {/* SAVE CONFIG / BLUEPRINT COPY ACTION */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    const blueprintText = DECISION_STEPS.map(step => {
                      const ansId = stepChoices[step.step];
                      const data = step.options.find(o => o.id === ansId);
                      return `Step ${step.step}: ${step.title} -> ${data ? data.label : 'Not chosen'}`;
                    }).join('\n');
                    handleCopyClipboard(`=== SYSTEM DRAFT BLUEPRINT ===\nGenerated on Stack Architect (Workspace Version: 3.5.2)\n\nComplexity: ${calculatedStats.complexity}\nOperational Cost: ${calculatedStats.costLevel}\n\n${blueprintText}`);
                  }}
                  className="w-full bg-[#18181B] text-white hover:bg-black font-semibold uppercase text-xs tracking-wider py-2.5 px-4 rounded transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  id="btn-copy-blueprint-flow"
                >
                  <Copy className="h-3.5 w-3.5" /> Export System Draft
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* TAB 2: STACK COMPARISON MATRIX */}
        {activeTab === 'table' && (
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
                      onClick={() => handleCopyClipboard(`=== PRECONFIGURED BLUEPRINT: ${selectedStackDetail.name} ===\n\nSpecs list:\n- Frontend: ${selectedStackDetail.frontend}\n- Styling: ${selectedStackDetail.styles}\n- Backend: ${selectedStackDetail.backend}\n- API paradigm: ${selectedStackDetail.api}\n- Database selection: ${selectedStackDetail.database}\n- DB utility layer: ${selectedStackDetail.dbAccess}\n- Process manager: ${selectedStackDetail.runtimeProcess}\n- Proxy controller: ${selectedStackDetail.proxy}\n- Telemetry client: ${selectedStackDetail.monitoring}\n\nIdeal For: ${selectedStackDetail.idealUse}`)}
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
        )}

        {/* TAB 3: VISUAL TOPOLOGY NODES */}
        {activeTab === 'graphs' && (
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
                    onClick={() => setActiveGraph(graph.id as any)}
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
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded text-center w-full shadow-sm hover:scale-103 transition-transform duration-200">
                      <span className="text-[10px] uppercase font-mono text-emerald-600 font-bold">Phase 1: Foundation</span>
                      <h4 className="text-sm font-black text-gray-900 mt-1">Plain JavaScript + DOM Operations</h4>
                    </div>
                    <ArrowDown className="text-gray-400" />
                    <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded text-center w-full shadow-sm hover:scale-103 transition-transform duration-200">
                      <span className="text-[10px] uppercase font-mono text-blue-600 font-bold">Phase 2: UI Library</span>
                      <h4 className="text-sm font-black text-gray-900 mt-1">TypeScript React + Vite Packaging</h4>
                    </div>
                    <ArrowDown className="text-gray-400" />
                    <div className="p-4 bg-[#18181B] text-white border-2 border-slate-900 rounded text-center w-full shadow-sm hover:scale-103 transition-transform duration-200">
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
        )}

        {/* TAB 4: QUESTONNAIRE WIZARD */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="tab-builder-content">
            
            {/* WIZARD QUESTION DESIGN BOARD (LEFT COLS) */}
            <div className="lg:col-span-7 flex flex-col gap-4" id="wizard-questions-panel">
              <div className="bg-white border border-[#D4D4D8] p-5 rounded shadow-sm">
                
                {/* WIZARD INTRODUCTION SECTION */}
                <div className="border-b border-[#D4D4D8] pb-4 mb-5">
                  <h2 className="text-base font-black text-[#18181B] flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" /> Architectural Recommendation Wizard
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Complete quick questionnaire checks to isolate the perfect technology framework stack.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* APP NAME INPUT */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#18181B] uppercase tracking-wider font-mono">
                      1. What is the production application name?
                    </label>
                    <input
                      type="text"
                      className="bg-[#F4F4F5] border border-[#D4D4D8] text-gray-950 font-bold placeholder-gray-400 py-2 px-3 text-xs rounded-sm focus:outline-hidden focus:border-blue-500"
                      value={wizardAnswers.appName}
                      onChange={(e) => setWizardAnswers(prev => ({ ...prev, appName: e.target.value }))}
                      id="input-wizard-appname"
                    />
                  </div>

                  {/* PLATFORM SCOPE CHOICE */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#18181B] uppercase tracking-wider font-mono">
                      2. What is the scope of your system model?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: 'saas', label: 'Multi-tenant Commercial SaaS', desc: 'SaaS Platforms, Stripe billing integrations' },
                        { id: 'realtime', label: 'Bidirectional Realtime System', desc: 'Collaboration tools, messaging servers' },
                        { id: 'dashboard', label: 'Data Dashboard & Reporting', desc: 'Heavy visual metrics tables, complex analytical queries' },
                        { id: 'internal', label: 'Enterprise Internal Portal', desc: 'Simple employee tooling setups, active directories' }
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setWizardAnswers(prev => ({ ...prev, appType: item.id }))}
                          className={`cursor-pointer p-3 border rounded text-left transition-all ${
                            wizardAnswers.appType === item.id
                              ? 'bg-blue-50/50 border-blue-600 shadow-xs'
                              : 'border-[#D4D4D8] hover:border-gray-400 bg-white'
                          }`}
                        >
                          <div className="font-bold text-xs text-gray-900">{item.label}</div>
                          <div className="text-[10px] text-gray-500 mt-1">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DEVELOPMENT SQUAD PROFILE CHOICE */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#18181B] uppercase tracking-wider font-mono">
                      3. What is your development squad profile?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: 'js-ts', label: 'Modern Unified TypeScript', desc: 'Enormous command of React hook states and Node ecosystems' },
                        { id: 'python', label: 'Data Science / Pythonistas', desc: 'Unparalleled focus inside FastAPI, Django, and ML libraries' },
                        { id: 'performance', label: 'Strict Performance Concurrent', desc: 'Ultra-low latency targets using Golang compiled servers' },
                        { id: 'traditional', label: 'Traditional Rapid PHP', desc: 'Majestic rapid features building inside Laravel or PHP stacks' }
                      ].map((exp) => (
                        <div
                          key={exp.id}
                          onClick={() => setWizardAnswers(prev => ({ ...prev, teamExp: exp.id }))}
                          className={`cursor-pointer p-3 border rounded text-left transition-all ${
                            wizardAnswers.teamExp === exp.id
                              ? 'bg-blue-50/50 border-blue-600 shadow-xs'
                              : 'border-[#D4D4D8] hover:border-gray-400 bg-white'
                          }`}
                        >
                          <div className="font-bold text-xs text-gray-900">{exp.label}</div>
                          <div className="text-[10px] text-gray-500 mt-1">{exp.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WIZARD RECOMMENDATION OUTPUT (RIGHT COLS) */}
            <div className="lg:col-span-5 flex flex-col gap-4" id="wizard-output-panel">
              <div className="bg-[#18181B] text-white p-5 rounded-sm shadow-md flex-1 flex flex-col justify-between">
                
                {/* WIZARD RECOMMENDATION TITLE SPEC */}
                <div>
                  <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest mb-1.5">
                    Engine Recommendation
                  </div>
                  <h3 className="text-lg font-black tracking-tight mb-2">
                    {generatedCustomStack ? generatedCustomStack.name : 'PERN Stack (Recommended)'}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Based on your requirements, we recommend building with {generatedCustomStack ? generatedCustomStack.name : 'PERN Stack'}. Here is your optimal configuration:
                  </p>

                  {/* BLUEPRINT MINI SPECS LIST */}
                  {generatedCustomStack && (
                    <div className="p-4 bg-gray-990 border border-gray-800 rounded-sm flex flex-col gap-2 font-mono text-[11px] mb-4">
                      <div className="flex justify-between border-b border-gray-800 pb-1.5">
                        <span className="text-gray-500">PROJECT CORE:</span>
                        <span className="text-blue-300 font-bold">{wizardAnswers.appName}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">FRONTEND ARCH:</span>
                        <span className="text-gray-200">{generatedCustomStack.frontend}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">BACKEND RUNTIME:</span>
                        <span className="text-gray-200">{generatedCustomStack.backend}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">DATABASE ENGINE:</span>
                        <span className="text-gray-200">{generatedCustomStack.database}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">DEPLOYMENT TARGET:</span>
                        <span className="text-gray-200">{generatedCustomStack.deployment}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-gray-500">INGRESS GATEWAY:</span>
                        <span className="text-gray-200">{generatedCustomStack.proxy}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-blue-950/40 border border-blue-900/50 rounded-sm">
                    <p className="text-[11px] text-blue-300 leading-relaxed font-sans">
                      💡 <strong>Why this matches:</strong> Sourcing high-performance parameters conforming to active squad talent profile and scaling targets.
                    </p>
                  </div>
                </div>

                {/* EXPORT SELECTION WIZARD TRIGGER BUTTONS */}
                <div className="flex flex-col gap-2 mt-6">
                  <button
                    onClick={() => {
                      if (!generatedCustomStack) return;
                      // Port selections to standard Step Choices
                      setStepChoices({
                        1: generatedCustomStack.frontend.toLowerCase().includes('react') ? 'react' : generatedCustomStack.frontend.toLowerCase().includes('vue') ? 'vue' : generatedCustomStack.frontend.toLowerCase().includes('svelte') ? 'svelte' : 'html5',
                        2: 'vite',
                        3: generatedCustomStack.styles.toLowerCase().includes('tailwind') ? 'tailwind' : 'css-modules',
                        4: generatedCustomStack.api.toLowerCase().includes('rest') ? 'rest' : 'websockets',
                        5: generatedCustomStack.backend.toLowerCase().includes('node') ? 'node-ts' : generatedCustomStack.backend.toLowerCase().includes('django') ? 'python' : generatedCustomStack.backend.toLowerCase().includes('fastapi') ? 'python' : generatedCustomStack.backend.toLowerCase().includes('laravel') ? 'php' : 'rust',
                        6: generatedCustomStack.backend.toLowerCase().includes('express') ? 'express' : generatedCustomStack.backend.toLowerCase().includes('django') ? 'django' : generatedCustomStack.backend.toLowerCase().includes('fastapi') ? 'fastapi' : generatedCustomStack.backend.toLowerCase().includes('laravel') ? 'laravel' : 'axum',
                        7: generatedCustomStack.dbAccess.toLowerCase().includes('prisma') ? 'orm' : 'query-builder',
                        8: generatedCustomStack.database.toLowerCase().includes('postgres') ? 'postgres' : generatedCustomStack.database.toLowerCase().includes('mysql') ? 'mysql' : 'sqlite',
                        9: 'sessions',
                        10: generatedCustomStack.deployment.toLowerCase().includes('render') ? 'paas' : 'vps',
                        11: generatedCustomStack.runtimeProcess.toLowerCase().includes('pm2') ? 'pm2' : 'systemd',
                        12: generatedCustomStack.proxy.toLowerCase().includes('nginx') ? 'nginx' : 'caddy',
                        13: generatedCustomStack.monitoring.toLowerCase().includes('sentry') ? 'sentry' : 'pm2-logs'
                      });
                      alert(`Successfully synchronized Step choices to recommended ${generatedCustomStack.name}!`);
                      setActiveTab('flow');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs tracking-wider py-2.5 rounded shadow-sm text-center"
                    id="btn-apply-wizard"
                  >
                    Commit Recommended Stack Spec
                  </button>
                  <button
                    onClick={() => {
                      if (!generatedCustomStack) return;
                      handleCopyClipboard(`=== SYSTEM AUTO GENERATED BLUEPRINT: ${wizardAnswers.appName} ===\n\nStack recommended: ${generatedCustomStack.name}\n\nLayer Parameters:\n- Frontend Architecture: ${generatedCustomStack.frontend}\n- Styling: ${generatedCustomStack.styles}\n- Backend computing: ${generatedCustomStack.backend}\n- API paradigm: ${generatedCustomStack.api}\n- Database selection: ${generatedCustomStack.database}\n- Ingress Gateway proxy: ${generatedCustomStack.proxy}`);
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold uppercase text-xs tracking-wider py-2 rounded transition-all text-center"
                    id="btn-copy-blueprint-wizard"
                  >
                    Export System Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#D4D4D8] bg-[#EBEBEB] px-6 py-6 mt-12 text-xs text-[#18181B]" id="main-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-blue-800 tracking-tight uppercase" id="footer-logo">Decision Matrix</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Precision architectural blueprinting sandbox</span>
          </div>

          <div className="flex items-center gap-4 text-gray-500 font-mono text-[10px]">
            <span>Build Ref: Stable-3.5.2</span>
            <span>Host Environment: Sandbox Container</span>
            <span>Version Control Sync ✅</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
