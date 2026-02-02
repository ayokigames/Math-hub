import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

// Initialize process.env polyfill before anything else
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
    
    // Attempt to dismiss loader after mount
    if (window['dismissLoader']) {
      setTimeout(() => window['dismissLoader'](), 300);
    }
  } catch (err) {
    console.error("Mount Failure:", err);
    if (window['dismissLoader']) window['dismissLoader']();
  }
};

mount();