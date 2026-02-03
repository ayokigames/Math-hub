import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const startApp = () => {
  console.log("Engine: Mounting Core...");
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
    
    // Auto-dismiss the loader after a short buffer
    setTimeout(() => {
      if (typeof (window as any).dismissLoader === 'function') {
        (window as any).dismissLoader();
      }
    }, 500);
  } catch (error) {
    console.error("Engine: Mount Failure", error);
    // Manual button in index.html remains as fallback
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}