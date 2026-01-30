import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import MathHubApp from './App.js';

const html = htm.bind(React.createElement);

const mount = () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    const root = ReactDOM.createRoot(rootElement);
    root.render(html`
      <${React.StrictMode}>
        <${MathHubApp} />
      <//>
    `);
  } catch (err) {
    console.error("Mount error:", err);
  }
};

mount();