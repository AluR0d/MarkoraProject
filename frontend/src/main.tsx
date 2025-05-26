import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import 'react-quill-new/dist/quill.snow.css';
import './utils/i18n.ts';
import './App.tsx';
import AppRouter from './router/index.tsx';
import { UserProvider } from './context/UserContext.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AppRouter />
    </UserProvider>
  </StrictMode>
);
