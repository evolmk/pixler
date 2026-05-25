import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

const DEFAULT_READY_PATTERN = /(ready|listening|started|running).*?(\d{4,5})/i;

@Injectable()
export class ReadyDetectorService {
  attach(
    emitter: EventEmitter,
    port: number | null,
    pattern?: string,
    onReady?: () => void,
  ): () => void {
    const regex = pattern ? new RegExp(pattern, 'i') : DEFAULT_READY_PATTERN;
    let fired = false;

    const check = (line: string) => {
      if (fired) return;
      if (regex.test(line)) {
        fired = true;
        onReady?.();
        return;
      }
      if (port) {
        const portPattern = new RegExp(`(?:port\\s*)?:?\\b${port}\\b`);
        if (portPattern.test(line)) {
          fired = true;
          onReady?.();
        }
      }
    };

    emitter.on('line', check);
    return () => emitter.off('line', check);
  }
}
