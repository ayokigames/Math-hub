import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

// Sync local environment
if (window['_env_'] && window['process']) {
  window['process'].env.API_KEY = window['_env_'].API_KEY || '';
}

console.log("Kernel: V7_RECOVERY_PROTOCOL_READY");

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("DOM_ERROR: Root not found");
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      html`
        <${React.StrictMode}>
          <${App} />
        <//>
      `
    );
    
    // Auto-dismiss the loader overlay on successful render
    if (window['dismissLoader']) {
      setTimeout(() => window['dismissLoader'](), 300);
    }
  } catch (err) {
    console.error("BOOT_EXCEPTION:", err);
    if (window['dismissLoader']) window['dismissLoader']();
  }
};

// Fire boot sequence
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mount();
} else {
  document.addEventListener('DOMContentLoaded', mount);
}