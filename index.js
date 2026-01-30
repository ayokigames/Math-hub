import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import MathHubApp from './App.js';

const html = htm.bind(React.createElement);

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(html`
      <${React.StrictMode}>
        <${MathHubApp} />
      <//>
    `);
  } catch (error) {
    console.error("Mounting error:", error);
    rootElement.innerHTML = `<div style="padding: 2rem; color: white; text-align: center;">
      <h1 style="font-family: Orbitron; margin-bottom: 1rem;">SYSTEM ERROR</h1>
      <p style="opacity: 0.6;">Critical failure during initialization. Check console for logs.</p>
    </div>`;
  }
};

mount();