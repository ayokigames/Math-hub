import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const mountHub = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const reveal = () => {
    if (typeof (window as any).forceDismiss === 'function') {
      (window as any).forceDismiss();
    }
  };

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      html`
        <${React.StrictMode}>
          <${App} />
        <//>
      `
    );
    
    // Attempt reveal as soon as the initial render cycle is complete
    requestAnimationFrame(() => {
      setTimeout(reveal, 100);
    });
    
  } catch (error) {
    console.error("FATAL_BOOT_ERROR:", error);
    reveal(); // Reveal anyway so user can see what's wrong or bypass
  }
};

// Check readyState to ensure script runs correctly
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHub);
} else {
    mountHub();
}