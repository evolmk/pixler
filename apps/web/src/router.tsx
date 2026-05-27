import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import { RootRoute } from './routes/index';
import { WorkspaceRoute } from './routes/workspace';

const rootRoute = createRootRoute({ component: () => <Outlet /> });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RootRoute,
});

const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/w/$workspaceId',
  component: WorkspaceRoute,
});

const routeTree = rootRoute.addChildren([indexRoute, workspaceRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
