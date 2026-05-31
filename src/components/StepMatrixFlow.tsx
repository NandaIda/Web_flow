import React from 'react';
import { CheckCircle2, ArrowRight, Cpu, Copy, AlertTriangle, Lock, HelpCircle } from 'lucide-react';
import { DECISION_STEPS } from '../data';
import { checkOptionCompatibility } from '../utils/compatibility';

interface StepMatrixFlowProps {
  stepChoices: Record<number, string>;
  currentStepperIndex: number;
  setCurrentStepperIndex: (index: number) => void;
  calculatedStats: {
    complexity: string;
    costLevel: string;
    databaseType: string;
    languageVibe: string;
  };
  setActiveTab: (tab: 'flow' | 'table' | 'graphs' | 'builder') => void;
  handleStepChoiceSelect: (step: number, choiceId: string) => void;
  handleCopyClipboard: (text: string) => void;
}

export default function StepMatrixFlow({
  stepChoices,
  currentStepperIndex,
  setCurrentStepperIndex,
  calculatedStats,
  setActiveTab,
  handleStepChoiceSelect,
  handleCopyClipboard
}: StepMatrixFlowProps) {
  
  const currentStep = DECISION_STEPS[currentStepperIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="tab-flow-content">
      
      {/* STEP CHOOSER CARD (LEFT COLS) */}
      <div className="lg:col-span-8 flex flex-col gap-6" id="flow-card-panel">
        
        {/* INTERACTIVE STEPPING STEP INDICATOR */}
        <div className="bg-white border border-[#D4D4D8] p-6 flex flex-col gap-4 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Step {currentStep.step} of {DECISION_STEPS.length}
            </h3>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200 uppercase font-black tracking-wider">
              Active Module Setup
            </span>
          </div>
          
          <h2 className="text-2xl font-black tracking-tight text-gray-950">
            {currentStep.title}
          </h2>
          <p className="text-base text-gray-700 leading-relaxed font-normal">
            {currentStep.subtitle}
          </p>
 
          {/* VISUAL DOT PROGRESS BAR */}
          <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1.5 scrollbar-none">
            {DECISION_STEPS.map((step, idx) => {
              const isSelected = idx === currentStepperIndex;
              const isCompleted = stepChoices[step.step] !== undefined;
              return (
                <button
                  key={step.step}
                  onClick={() => setCurrentStepperIndex(idx)}
                  id={`step-dot-trigger-${step.step}`}
                  className={`text-xs font-semibold font-mono h-8 w-8 px-2 rounded-sm flex items-center justify-center transition-all min-w-[32px] shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm ring-2 ring-blue-600/20 scale-105'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentStep.options.map((opt) => {
            const isSelected = stepChoices[currentStep.step] === opt.id;
            const compat = checkOptionCompatibility(currentStep.step, opt.id, stepChoices);
            const isLock = compat.isIncompatible;

            return (
              <div
                key={opt.id}
                onClick={() => {
                  if (!isLock) {
                    handleStepChoiceSelect(currentStep.step, opt.id);
                  }
                }}
                id={`option-${opt.id}`}
                className={`transition-all rounded border-2 p-5 flex flex-col justify-between h-full select-none ${
                  isLock 
                    ? 'opacity-40 bg-zinc-50 border-dashed border-gray-300 cursor-not-allowed grayscale'
                    : isSelected
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10 cursor-pointer scale-[1.01]'
                    : 'bg-white border-[#D4D4D8]/80 hover:border-gray-500 cursor-pointer shadow-xs hover:shadow-sm'
                }`}
              >
                <div>
                  {/* TAG LINE AND OPTION TITLE */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`font-black text-base tracking-tight flex items-center gap-2 ${isLock ? 'text-gray-400' : 'text-gray-950'}`}>
                      {isLock ? (
                        <Lock className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                      ) : (
                        isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                      )}
                      {opt.label}
                    </h3>
                    
                    {opt.badge && !isLock && (
                      <span className="text-xs bg-emerald-50 border border-emerald-300 text-emerald-700 px-2.5 py-0.5 rounded font-mono font-bold tracking-tight">
                        {opt.badge}
                      </span>
                    )}

                    {isLock && (
                      <span className="text-[10px] bg-red-50 border border-red-250 text-red-700 px-2 py-0.5 rounded font-mono font-bold">
                        CLOSED
                      </span>
                    )}
                  </div>
 
                  {isLock ? (
                    <div className="bg-red-50 border border-red-200 p-2.5 rounded text-xs text-red-900 mb-3 leading-relaxed flex items-start gap-1.5 font-sans">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                      <div>
                        <strong>Incompatible:</strong> {compat.reason}
                        <div className="mt-1 text-[10px] uppercase font-mono text-gray-500">
                          Conflict source: Step {compat.sourceStep} ({compat.sourceLabel})
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal mb-4">
                      {opt.desc}
                    </p>
                  )}
                </div>
 
                {/* PROS AND CONS LIST */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="space-y-1.5 mb-3">
                    {opt.pros.slice(0, 2).map((pro, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-1.5 text-xs md:text-sm text-emerald-800 font-semibold leading-normal">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                    {opt.cons.slice(0, 1).map((con, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-1.5 text-xs md:text-sm text-red-800 font-normal leading-normal">
                        <span className="text-red-400 font-bold shrink-0">✗</span>
                        <span className="opacity-80">{con}</span>
                      </div>
                    ))}
                  </div>
 
                  {/* POPULARITY STATS BAR */}
                  <div className="flex items-center justify-between text-xs font-mono text-gray-400 pt-2 border-t border-gray-50">
                    <span>Developer Share</span>
                    <span className="font-extrabold text-gray-700 text-xs">{opt.popularity}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setCurrentStepperIndex(Math.max(0, currentStepperIndex - 1))}
            disabled={currentStepperIndex === 0}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-[#D4D4D8] text-gray-700 hover:bg-gray-50 disabled:opacity-40 rounded-sm"
            id="btn-flow-prev"
          >
            Previous Step
          </button>
          
          {currentStepperIndex < DECISION_STEPS.length - 1 ? (
            <button
              onClick={() => setCurrentStepperIndex(Math.min(DECISION_STEPS.length - 1, currentStepperIndex + 1))}
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
      <aside className="lg:col-span-4 border border-[#D4D4D8] bg-[#EBEBEB] p-6 rounded flex flex-col gap-6 self-start shadow-sm" id="progress-rail">
        <div>
          <h2 className="text-xs md:text-sm font-black text-gray-700 uppercase mb-2 tracking-wider font-mono">
            Map Navigation Progress
          </h2>
          <div className="h-1.5 bg-gray-300 w-full rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(Object.keys(stepChoices).length / DECISION_STEPS.length) * 100}%` }}
            />
          </div>
 
          {/* CURRENT CHOICES MINI-RAIL TEXT LIST */}
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {DECISION_STEPS.map((step) => {
              const chosenId = stepChoices[step.step];
              const matchedOpt = step.options.find(o => o.id === chosenId);
              return (
                <div 
                  key={step.step} 
                  onClick={() => setCurrentStepperIndex(step.step - 1)}
                  className={`cursor-pointer p-2.5 flex items-center justify-between text-xs md:text-sm transition-all border rounded-sm ${
                    step.step === currentStepperIndex + 1 
                      ? 'bg-white border-blue-500 font-bold text-blue-600 shadow-xs' 
                      : 'hover:bg-white/50 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#71717A] tracking-tighter">#{step.step}</span>
                    <span className="text-[#18181B] truncate max-w-[155px] font-medium">{step.title}</span>
                  </div>
                  <span className="font-mono font-bold text-gray-700 text-xs whitespace-nowrap bg-zinc-150 px-2 py-0.5 rounded border border-zinc-300 shadow-2xs">
                    {matchedOpt ? matchedOpt.label.split(' ')[0] : 'None'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
 
        {/* SYSTEM COMPLEXITY GAUGES */}
        <div className="p-5 bg-[#D4D4D8] rounded flex flex-col gap-3 shadow-sm" id="stats-overview-box">
          <div className="flex justify-between text-xs md:text-sm font-mono text-[#18181B] font-extrabold uppercase border-b border-[#A1A1AA]/50 pb-2">
            <span className="flex items-center gap-1.5"><Cpu className="h-4.5 w-4.5 text-blue-600" /> Complexity Rating</span>
            <span>{calculatedStats.complexity}</span>
          </div>
          
          <div className="h-2 w-full bg-[#A1A1AA] rounded-full overflow-hidden my-1">
            <div 
              className="h-full bg-[#18181B] transition-all duration-300" 
              style={{ width: `${calculatedStats.complexity.includes('Enterprise') ? '90%' : calculatedStats.complexity.includes('Medium') ? '65%' : '35%'}` }}
            />
          </div>
 
          <div className="grid grid-cols-2 gap-4 mt-2 font-mono text-xs text-gray-850">
            <div className="flex flex-col">
              <span className="uppercase text-[10px] text-gray-600 tracking-wider font-bold mb-0.5">Estimated Cost</span>
              <span className="text-[#18181B] font-extrabold leading-normal">{calculatedStats.costLevel}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase text-[10px] text-gray-600 tracking-wider font-bold mb-0.5">DB Paradigm</span>
              <span className="text-[#18181B] font-extrabold truncate leading-normal">{calculatedStats.databaseType}</span>
            </div>
          </div>
          
          <div className="font-mono text-xs text-gray-850 border-t border-[#A1A1AA]/50 pt-2.5 flex flex-col">
            <span className="uppercase text-[10px] text-gray-600 tracking-wider font-bold mb-0.5">Language Vibe</span>
            <span className="text-[#18181B] font-extrabold leading-normal">{calculatedStats.languageVibe}</span>
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
            className="w-full bg-[#18181B] hover:bg-black text-white font-extrabold uppercase text-xs tracking-widest py-3 px-4 rounded transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            id="btn-copy-blueprint-flow"
          >
            <Copy className="h-4 w-4 text-blue-400" /> Export System Draft
          </button>
        </div>
      </aside>
    </div>
  );
}
