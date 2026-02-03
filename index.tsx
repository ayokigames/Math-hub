import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const startEngine = () => {
  console.log("Kernel: Initializing Hub V27...");
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
    
    // Attempt to dismiss after a tiny delay for React to mount its first frame
    requestAnimationFrame(() => {
      setTimeout(dismiss, 150);
    });
    
  } catch (error) {
    console.error("Critical Kernel Error:", error);
    dismiss();
  }
};

// Start boot sequence
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
} else {
    startEngine();
}