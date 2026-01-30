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
    rootElement.innerHTML = `<div style="padding: 2rem; color: white;">Error loading application. Check console for details.</div>`;
  }
};

mount();