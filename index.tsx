import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const boot = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      html`
        <${React.StrictMode}>
          <${App} />
        <//>
      `
    );
    
    // Immediate dismissal handshake
    if (typeof (window as any).forceDismiss === 'function') {
      // Delay slightly to allow the first paint of the app
      setTimeout((window as any).forceDismiss, 150);
    }
  } catch (err) {
    console.error("Critical Kernel Panic:", err);
    // If React fails to render, we still want the user to see whatever is there
    if (typeof (window as any).forceDismiss === 'function') {
      (window as any).forceDismiss();
    }
  }
};

// Start as soon as possible
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  boot();
} else {
  window.addEventListener('DOMContentLoaded', boot);
}