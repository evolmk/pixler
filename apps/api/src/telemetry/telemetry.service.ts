import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { SettingsService } from '../settings/settings.service';
import { sanitizeProps } from './sanitize';

interface TelemetryEvent {
  name: string;
  props: Record<string, unknown>;
  ts: number;
}

const FLUSH_INTERVAL_MS = 60_000;
const CONFIG_DIR = join(homedir(), '.config', 'pixler');
const DEVICE_ID_FILE = join(CONFIG_DIR, 'device-id');
const TELEMETRY_URL = process.env.PIXLER_TELEMETRY_URL ?? '';

@Injectable()
export class TelemetryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelemetryService.name);
  private readonly deviceId: string;
  private readonly buffer: TelemetryEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(private readonly settings: SettingsService) {
    this.deviceId = this.loadOrCreateDeviceId();
  }

  onModuleInit() {
    this.flushTimer = setInterval(() => void this.flush(), FLUSH_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.flushTimer) clearInterval(this.flushTimer);
    void this.flush();
  }

  track(name: string, props: Record<string, unknown> = {}): void {
    const enabled = this.settings.get('telemetry.enabled') as boolean;
    if (!enabled) return;
    this.buffer.push({ name, props: sanitizeProps(props), ts: Date.now() });
  }

  async flush(): Promise<void> {
    if (!TELEMETRY_URL || this.buffer.length === 0) return;
    const enabled = this.settings.get('telemetry.enabled') as boolean;
    if (!enabled) { this.buffer.length = 0; return; }

    const batch = this.buffer.splice(0, this.buffer.length);
    try {
      await fetch(TELEMETRY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: this.deviceId, events: batch }),
      });
    } catch (err) {
      this.logger.debug(`Telemetry flush failed: ${String(err)}`);
    }
  }

  private loadOrCreateDeviceId(): string {
    try {
      if (existsSync(DEVICE_ID_FILE)) {
        return readFileSync(DEVICE_ID_FILE, 'utf8').trim();
      }
      mkdirSync(CONFIG_DIR, { recursive: true });
      const id = randomUUID();
      writeFileSync(DEVICE_ID_FILE, id, 'utf8');
      return id;
    } catch {
      return 'anonymous';
    }
  }
}
