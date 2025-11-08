import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AppContentProvider from './context/AppContext.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <StrictMode>
    <AppContentProvider>    <App /></AppContentProvider>

  </StrictMode>
  </BrowserRouter>
);
