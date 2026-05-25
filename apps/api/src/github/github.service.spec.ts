import { Test } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GhExecService } from './gh-exec.service';
import { DatabaseService } from '../db/database.service';

const mockGh = {
  exec: jest.fn(),
  execJson: jest.fn(),
};

const mockDb = {
  connection: {
    prepare: jest.fn(() => ({ get: jest.fn() })),
  },
};

describe('GithubService', () => {
  let service: GithubService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GithubService,
        { provide: GhExecService, useValue: mockGh },
        { provide: DatabaseService, useValue: mockDb },
      ],
    }).compile();

    service = module.get(GithubService);
    jest.clearAllMocks();
  });

  describe('getAuthStatus', () => {
    it('returns authed=true and parses username', async () => {
      mockGh.exec.mockResolvedValue({
        stdout: "Logged in to github.com account octocat (keyring)\nToken scopes: 'repo', 'read:org'",
        stderr: '',
      });
      const result = await service.getAuthStatus();
      expect(result.authed).toBe(true);
      expect(result.username).toBe('octocat');
    });

    it('returns authed=false when not logged in', async () => {
      mockGh.exec.mockRejectedValue(new Error('not logged in to any GitHub hosts'));
      const result = await service.getAuthStatus();
      expect(result.authed).toBe(false);
    });
  });
});
