import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { queryClient } from './lib/query';
import { router } from './router';
import { RootErrorBoundary } from './components/RootErrorBoundary';
// Side-effect import: applies the active theme to <html> at boot and registers
// the prefers-color-scheme listener (see stores/theme.ts).
import './stores/theme';
import './styles/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
