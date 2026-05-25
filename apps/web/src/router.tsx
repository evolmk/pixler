import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { HomeRoute } from './routes/index';
import { ProjectShell } from './routes/project';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeRoute,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/p/$projectId',
  component: ProjectShell,
});

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/p/$projectId/w/$workspaceId',
  component: ProjectShell,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  projectRoute,
  workspaceRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
