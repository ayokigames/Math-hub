import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const start = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const reveal = () => {
    if (typeof (window as any).forceDismiss === 'function') {
      (window as any).forceDismiss();
    }
  };

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      html`
        <${React.StrictMode}>
          <${App} />
        <//>
      `
    );
    
    // Tiny delay to allow React to mount its first frame
    requestAnimationFrame(() => {
      setTimeout(reveal, 100);
    });
    
  } catch (error) {
    console.error("Mount error:", error);
    reveal();
  }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}