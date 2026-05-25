import { Component, type ErrorInfo, type ReactNode } from 'react';
import { toast } from '@pixler/ui/components/sonner';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@pixler/ui/components/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  crashId: string | null;
}

async function reportCrash(source: string, message: string, stack: string): Promise<string | null> {
  try {
    const res = await fetch('/api/crashes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, message, stack }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id: string };
    return data.id;
  } catch {
    return null;
  }
}

export class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, crashId: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    void reportCrash('react', error.message, error.stack ?? info.componentStack ?? '').then((id) => {
      this.setState({ crashId: id });
      toast.error('Pixler hit a snag — see error boundary.');
    });
  }

  componentDidMount() {
    const handleError = (e: ErrorEvent) => {
      void reportCrash('window.onerror', e.message, e.error?.stack ?? '');
    };
    const handleUnhandled = (e: PromiseRejectionEvent) => {
      const err = e.reason instanceof Error ? e.reason : new Error(String(e.reason));
      void reportCrash('unhandledrejection', err.message, err.stack ?? '');
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandled);
    this._cleanup = () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandled);
    };
  }

  private _cleanup?: () => void;

  componentWillUnmount() {
    this._cleanup?.();
  }

  render() {
    if (this.state.hasError) {
      const report = JSON.stringify(
        { crashId: this.state.crashId, message: this.state.error?.message, stack: this.state.error?.stack },
        null,
        2,
      );
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
          <AlertTriangle className="size-12 text-destructive" />
          <h1 className="text-lg font-semibold">Pixler hit a snag</h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            Something went wrong. You can copy the crash report below and reload.
          </p>
          <pre className="max-h-48 w-full max-w-lg overflow-auto rounded-md border border-border bg-muted p-3 text-left text-[11px] font-mono text-muted-foreground">
            {report}
          </pre>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void navigator.clipboard.writeText(report)}
            >
              Copy report
            </Button>
            <Button size="sm" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
