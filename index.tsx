import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const startEngine = () => {
  console.log("Kernel: Initializing Tactical Command Hub...");
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
    
    // Once React has started its render cycle, wait a beat and clear the loader
    // Using requestAnimationFrame to ensure we are in a paint cycle
    requestAnimationFrame(() => {
        setTimeout(() => {
            if (typeof (window as any).dismissLoader === 'function') {
                (window as any).dismissLoader();
            }
        }, 100);
    });
    
  } catch (err) {
    console.error("Critical Kernel Panic during mount:", err);
    // Even if it fails, reveal the DOM so the user sees the error container
    if (typeof (window as any).dismissLoader === 'function') {
        (window as any).dismissLoader();
    }
  }
};

// Execute boot protocol
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    startEngine();
} else {
    window.addEventListener('load', startEngine);
}