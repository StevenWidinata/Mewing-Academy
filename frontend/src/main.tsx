import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import { SettingsProvider } from './state/settings';

// The service worker is registered by <UpdatePrompt /> (in App), which
// offers to update when a new version is deployed.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </StrictMode>,
);
