import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

console.log("Booting Kernel V10...");

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      html`
        <${React.StrictMode}>
          <${App} />
        <//>
      `
    );
    
    // Auto-dismiss the loader after React successfully renders
    if (typeof window['dismissLoader'] === 'function') {
      setTimeout(() => window['dismissLoader'](), 300);
    }
  } catch (err) {
    console.error("BOOT_EXCEPTION:", err);
    // If we crash, the button in HTML still allows manual bypass
  }
};

// Fire boot sequence immediately if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mount();
} else {
  document.addEventListener('DOMContentLoaded', mount);
}