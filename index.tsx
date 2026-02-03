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
    
    // Handshake: Dismiss loader once React takes control
    const dismiss = () => {
      if (typeof (window as any).__RECOVERY_BYPASS__ === 'function') {
        (window as any).__RECOVERY_BYPASS__();
      }
    };

    // Use requestAnimationFrame to ensure we reveal after the first paint
    requestAnimationFrame(() => {
        setTimeout(dismiss, 200);
    });
    
  } catch (err) {
    console.error("Critical Kernel Panic during mount:", err);
    // Force reveal so user can see at least the partial DOM or error state
    if (typeof (window as any).__RECOVERY_BYPASS__ === 'function') {
        (window as any).__RECOVERY_BYPASS__();
    }
  }
};

// Start initialization sequence
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
} else {
    startEngine();
}