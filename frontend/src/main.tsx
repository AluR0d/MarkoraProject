import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css'
import 'leaflet/dist/leaflet.css';
import 'react-quill-new/dist/quill.snow.css';
import './utils/i18n.ts';
import './App.tsx';
import AppRouter from './router/index.tsx';
import { UserProvider } from './context/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AppRouter />
    </UserProvider>
  </StrictMode>
);
