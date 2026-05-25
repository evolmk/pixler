import { test, expect } from '@playwright/test';
import os from 'os';

test('GET /api/workspaces with projectId returns array', async ({ request }) => {
  // First get or create a project to use as context
  const projectsRes = await request.get('/api/projects');
  const projects = await projectsRes.json();

  if (projects.length === 0) {
    // Create a test project
    const createRes = await request.post('/api/projects/add-local', {
      data: { path: os.tmpdir() },
    });
    expect([200, 201, 400]).toContain(createRes.status());
  }

  const allProjects = await (await request.get('/api/projects')).json();
  if (allProjects.length === 0) {
    test.skip(true, 'No projects available to query workspaces for');
    return;
  }

  const projectId: string = allProjects[0].id;
  const res = await request.get(`/api/workspaces?projectId=${projectId}`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
});
