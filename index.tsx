import React from 'react';
import ReactDOM from 'react-dom/client';
import htm from 'htm';
import App from './App.tsx';

const html = htm.bind(React.createElement);

const startEngine = () => {
  console.log("Kernel: Initializing Hub V26...");
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const dismiss = () => {
    const loader = document.getElementById('emergency-loader');
    if (loader) {
      loader.style.display = 'none';
      if (loader.parentNode) loader.parentNode.removeChild(loader);
    }
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
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
      setTimeout(dismiss, 100);
    });
    
  } catch (error) {
    console.error("Critical Kernel Error:", error);
    dismiss();
  }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
} else {
    startEngine();
}