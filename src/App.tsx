import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import TabsNavigation, { TabType } from './components/TabsNavigation';
import ConversationalFlow from './components/ConversationalFlow';
import VisualFlowchart from './components/VisualFlowchart';
import Vibecoder from './components/Vibecoder';
import LearnMore from './components/LearnMore';
import Footer from './components/Footer';
import { AnswerMap } from './data/conversationalFlow';
import { PREDEFINED_STACKS } from './data';
import { useDarkMode } from './utils/useDarkMode';

const LS_WIZARD_KEY = 'webflow_wizard_state';

export default function App() {
  const [dark, toggleDark] = useDarkMode();
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
    <div className="min-h-screen bg-[#F4F4F5] dark:bg-[#0F0F11] text-[#18181B] dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200" id="root-container">

      <div className="sticky top-0 z-50">
        <Header predefinedStacksCount={PREDEFINED_STACKS.length} dark={dark} onToggleDark={toggleDark} />
        <TabsNavigation activeTab={activeTab} setActiveTab={switchTab} />
      </div>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto" id="main-content-layout">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {activeTab === 'flow' && (
              <ConversationalFlow
                handleCopyClipboard={handleCopyClipboard}
                onComplete={(answers) => setWizardAnswers(answers)}
                onViewDiagram={() => switchTab('graphs')}
              />
            )}
            {activeTab === 'graphs' && (
              <VisualFlowchart
                answers={wizardAnswers}
                handleCopyClipboard={handleCopyClipboard}
              />
            )}
            {activeTab === 'builder' && (
              <Vibecoder
                answers={wizardAnswers}
                handleCopyClipboard={handleCopyClipboard}
                onGoToBuilder={() => switchTab('flow')}
              />
            )}
            {activeTab === 'learn' && (
              <LearnMore />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
