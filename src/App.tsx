import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import TabsNavigation from './components/TabsNavigation';
import StepMatrixFlow from './components/StepMatrixFlow';
import StackComparisonMatrix from './components/StackComparisonMatrix';
import VisualTopologyNodes from './components/VisualTopologyNodes';
import AutoStackQuestionnaire from './components/AutoStackQuestionnaire';
import Footer from './components/Footer';

import {
  DECISION_STEPS,
  PREDEFINED_STACKS
} from './data';

type TabType = 'flow' | 'table' | 'graphs' | 'builder';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('flow');

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
          updated[6] = 'gin-gonic';
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

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] flex flex-col font-sans selection:bg-blue-600 selection:text-white" id="root-container">
      
      {/* HIGH DENSITY HEADER */}
      <Header predefinedStacksCount={PREDEFINED_STACKS.length} />

      {/* COHESIVE TAB SWITCHER BAR */}
      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* PRIMARY GRID LAYOUT CONTAINER */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto" id="main-content-layout">

        {/* TAB 1: 13-STEP MATRIX FLOW */}
        {activeTab === 'flow' && (
          <StepMatrixFlow
            stepChoices={stepChoices}
            currentStepperIndex={currentStepperIndex}
            setCurrentStepperIndex={setCurrentStepperIndex}
            calculatedStats={calculatedStats}
            setActiveTab={setActiveTab}
            handleStepChoiceSelect={handleStepChoiceSelect}
            handleCopyClipboard={handleCopyClipboard}
          />
        )}

        {/* TAB 2: STACK COMPARISON MATRIX */}
        {activeTab === 'table' && (
          <StackComparisonMatrix
            setStepChoices={setStepChoices}
            setActiveTab={setActiveTab}
            handleCopyClipboard={handleCopyClipboard}
          />
        )}

        {/* TAB 3: VISUAL TOPOLOGY NODES */}
        {activeTab === 'graphs' && (
          <VisualTopologyNodes
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 4: AUTO-STACK QUESTIONNAIRE */}
        {activeTab === 'builder' && (
          <AutoStackQuestionnaire
            setStepChoices={setStepChoices}
            setActiveTab={setActiveTab}
            handleCopyClipboard={handleCopyClipboard}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
