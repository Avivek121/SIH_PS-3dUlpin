import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Automatically use HashRouter for GitHub Pages to avoid 404s on page refresh
const isGitHubPages = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';
const RouterComponent = isGitHubPages ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterComponent>
      <App />
    </RouterComponent>
  </React.StrictMode>
);

