import { Injectable } from '@nestjs/common';
import { createServer } from 'net';
import { DatabaseService } from '../db/database.service';

const PORT_START = 7100;
const PORT_MAX = 7999;

@Injectable()
export class PortAllocatorService {
  constructor(private readonly db: DatabaseService) {}

  async allocate(): Promise<number> {
    const used = this.usedPorts();
    for (let port = PORT_START; port <= PORT_MAX; port++) {
      if (!used.has(port) && (await this.isFree(port))) {
        return port;
      }
    }
    throw new Error('No free port available in range 7100–7999');
  }

  private usedPorts(): Set<number> {
    const rows = this.db.connection
      .prepare('SELECT port FROM workspaces WHERE port IS NOT NULL AND archived_at IS NULL')
      .all() as { port: number }[];
    return new Set(rows.map((r) => r.port));
  }

  private isFree(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => server.close(() => resolve(true)));
      server.listen(port, '127.0.0.1');
    });
  }
}
