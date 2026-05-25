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

function reportFrontendError(message: string, stack: string) {
  fetch('/api/crashes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'frontend',
      message,
      stack,
      context: { url: location.href, userAgent: navigator.userAgent },
    }),
  }).catch(() => {/* best-effort */});
}

window.addEventListener('error', (e) => {
  reportFrontendError(e.message, e.error?.stack ?? '');
});

window.addEventListener('unhandledrejection', (e) => {
  const err = e.reason instanceof Error ? e.reason : new Error(String(e.reason));
  reportFrontendError(err.message, err.stack ?? '');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
