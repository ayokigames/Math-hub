import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

// Ensure process.env is synced
if (typeof window['process'] === 'undefined') {
  window['process'] = { env: { API_KEY: window['_env_']?.API_KEY || '' } };
}

console.log("System Status: COMMAND_V6_ACTIVE");

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
    
    // Auto-dismiss the loader overlay on successful render
    if (window['dismissLoader']) {
      setTimeout(() => window['dismissLoader'](), 400);
    }
  } catch (err) {
    console.error("Critical System Hang detected:", err);
    // Attempt emergency UI recovery
    rootElement.innerHTML = `
      <div style="padding: 100px; text-align: center; color: white; font-family: 'Orbitron', sans-serif;">
        <h1 style="color: #6366f1;">REBOOT_REQUIRED</h1>
        <p style="opacity: 0.5; font-size: 11px; margin-top: 10px;">KERNEL_ERROR: VERSION_MISMATCH_RECOVERED</p>
        <button onclick="location.reload()" style="margin-top: 30px; padding: 15px 30px; background: #6366f1; border: none; border-radius: 8px; color: white; cursor: pointer; font-family: 'Orbitron'; text-transform: uppercase; font-weight: 900;">Restart Protocol</button>
      </div>
    `;
    if (window['dismissLoader']) window['dismissLoader']();
  }
};

// Fire boot protocol
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mount();
} else {
  document.addEventListener('DOMContentLoaded', mount);
}