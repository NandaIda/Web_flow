import React from 'react';

export default function Footer() {
  return (
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
  );
}
