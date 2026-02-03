import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

console.log("Kernel: Math Hub V9 (React 18.3.1 Stable)");

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
    
    // Auto-dismiss the loader after React takes control
    setTimeout(() => {
        if (typeof window['dismissLoader'] === 'function') {
            window['dismissLoader']();
        }
    }, 500);
  } catch (err) {
    console.error("Mounting Error:", err);
    // If we fail here, the Force Launch button in HTML still works.
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mount();
} else {
  document.addEventListener('DOMContentLoaded', mount);
}