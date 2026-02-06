import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const startEngine = () => {
  console.log("Kernel: Initializing Hub Engine...");
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const dismiss = () => {
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
    
    // Reveal UI as soon as React starts its render loop
    requestAnimationFrame(() => {
      setTimeout(dismiss, 100);
    });
    
  } catch (error) {
    console.error("Critical Engine Error during mount:", error);
    dismiss();
  }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
} else {
    startEngine();
}