import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabsNavigation, { TabType } from './components/TabsNavigation';
import ConversationalFlow from './components/ConversationalFlow';
import VisualFlowchart from './components/VisualFlowchart';
import Vibecoder from './components/Vibecoder';
import LearnMore from './components/LearnMore';
import Footer from './components/Footer';
import { AnswerMap } from './data/conversationalFlow';
import { PREDEFINED_STACKS } from './data';

const LS_WIZARD_KEY = 'webflow_wizard_state';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try { return (localStorage.getItem('webflow_active_tab') as TabType) || 'flow'; } catch { return 'flow'; }
  });

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    try { localStorage.setItem('webflow_active_tab', tab); } catch {}
  };
  const [wizardAnswers, setWizardAnswers] = useState<AnswerMap>(() => {
    try {
      const raw = localStorage.getItem(LS_WIZARD_KEY);
      return raw ? (JSON.parse(raw)?.answers ?? {}) : {};
    } catch { return {}; }
  });

  const handleCopyClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#18181B] flex flex-col font-sans selection:bg-blue-600 selection:text-white" id="root-container">

      <div className="sticky top-0 z-50">
        <Header predefinedStacksCount={PREDEFINED_STACKS.length} />
        <TabsNavigation activeTab={activeTab} setActiveTab={switchTab} />
      </div>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto" id="main-content-layout">

        {/* TAB 1: STACK BUILDER */}
        {activeTab === 'flow' && (
          <ConversationalFlow
            handleCopyClipboard={handleCopyClipboard}
            onComplete={(answers) => setWizardAnswers(answers)}
            onViewDiagram={() => switchTab('graphs')}
          />
        )}

        {/* TAB 2: VISUAL MAP */}
        {activeTab === 'graphs' && (
          <VisualFlowchart
            answers={wizardAnswers}
            handleCopyClipboard={handleCopyClipboard}
          />
        )}

        {/* TAB 3: VIBECODER */}
        {activeTab === 'builder' && (
          <Vibecoder
            answers={wizardAnswers}
            handleCopyClipboard={handleCopyClipboard}
            onGoToBuilder={() => switchTab('flow')}
          />
        )}

        {/* TAB 4: READ MORE */}
        {activeTab === 'learn' && (
          <LearnMore />
        )}

      </main>

      <Footer />
    </div>
  );
}
