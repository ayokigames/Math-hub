import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const mountApp = () => {
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
    
    // Attempt to dismiss loader once React starts its cycle
    setTimeout(() => {
      if (typeof (window as any).dismissLoader === 'function') {
        (window as any).dismissLoader();
      }
    }, 400);
  } catch (err) {
    console.error("Mount Failure:", err);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}