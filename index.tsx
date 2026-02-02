import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

// CRITICAL: Polyfill process for browser ESM compatibility IMMEDIATELY
if (typeof window['process'] === 'undefined') {
  window['process'] = { 
    env: { 
      API_KEY: window['_env_']?.API_KEY || '' 
    } 
  };
}

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
    
    // Dismiss the loader after React has finished the initial render cycle
    if (window['dismissLoader']) {
      setTimeout(() => window['dismissLoader'](), 200);
    }
  } catch (err) {
    console.error("Mount Failure:", err);
    if (window['dismissLoader']) window['dismissLoader']();
  }
};

mount();