import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ChatbotHelper: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <a
      href="https://docs.google.com/document/d/1j169YY3rtR4osTqPNUCRyxFYro9--mpeBuYOc8-TtzQ/edit?tab=t.0"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999] flex items-end md:items-center gap-3 animate-fadeIn group flex-col md:flex-row"
    >
      <div className="bg-white/90 backdrop-blur-sm px-4 md:px-5 py-3 rounded-2xl md:rounded-full shadow-xl border border-slate-200 flex items-center gap-2">
        <p className="text-xs md:text-sm font-black text-slate-700">¿Tenés dudas de cómo llenar los datos? <span className="text-blue-600 underline">Cliqueá acá</span></p>
      </div>
      <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-4 rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3 shadow-blue-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </a>,
    document.body
  );
};

export default ChatbotHelper;
