import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#D4D4D8] dark:border-zinc-700 bg-[#EBEBEB] dark:bg-zinc-900 px-6 py-6 mt-12 text-xs text-[#18181B] dark:text-zinc-300" id="main-footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-blue-800 dark:text-blue-400 tracking-tight uppercase" id="footer-logo">Decision Matrix</span>
          <span className="text-gray-400 dark:text-zinc-500">|</span>
          <span className="text-gray-600 dark:text-zinc-400">Precision architectural blueprinting sandbox</span>
        </div>

        <div className="flex items-center gap-4 text-gray-500 dark:text-zinc-500 font-mono text-[10px]">
          <span>Build Ref: Stable-3.5.2</span>
          <span>Host Environment: Sandbox Container</span>
          <span>Version Control Sync ✅</span>
        </div>
      </div>
    </footer>
  );
}
