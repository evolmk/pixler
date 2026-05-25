import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { Copy } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Button } from '@pixler/ui/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@pixler/ui/components/tabs';
import { useThemeStore } from '../../stores/theme';

const PIXLER_VARS = [
  { name: '$PIXLER_ROOT_PATH', desc: 'Original repo root' },
  { name: '$PIXLER_WORKSPACE_PATH', desc: "Workspace's worktree path" },
  { name: '$PIXLER_WORKSPACE_NAME', desc: 'Workspace name' },
  { name: '$PIXLER_PORT', desc: 'Auto-assigned port' },
  { name: '$PIXLER_TICKET_ID', desc: 'Linear/GitHub issue ID' },
  { name: '$PIXLER_BRANCH', desc: 'Branch name' },
];

const PLACEHOLDER: Record<string, string> = {
  setup: '#!/bin/bash\n\n# Copy .env, install deps, seed databases…\ncp $PIXLER_ROOT_PATH/.env $PIXLER_WORKSPACE_PATH/.env\npnpm install\n',
  run: '#!/bin/bash\n\n# Launch dev server on the allocated port…\nPORT=$PIXLER_PORT pnpm dev\n',
  archive: '#!/bin/bash\n\n# Clean up workspace resources…\n',
};

export function ScriptsPanel() {
  const resolvedMode = useThemeStore((s) => s.resolvedMode);
  const [scripts, setScripts] = useState<Record<string, string>>({
    setup: '',
    run: '',
    archive: '',
  });

  const monacoTheme = resolvedMode === 'dark' ? 'vs-dark' : 'light';

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="setup">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="run">Run</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>
        {(['setup', 'run', 'archive'] as const).map((key) => (
          <TabsContent key={key} value={key}>
            <div className="overflow-hidden rounded-md border border-border">
              <Editor
                height="200px"
                language="shell"
                theme={monacoTheme}
                value={scripts[key] ?? ''}
                onChange={(val) => setScripts((prev) => ({ ...prev, [key]: val ?? '' }))}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  placeholder: PLACEHOLDER[key],
                }}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* $PIXLER_* reference */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Available variables
        </p>
        <div className="flex flex-col gap-1">
          {PIXLER_VARS.map(({ name, desc }) => (
            <div key={name} className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-accent">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-foreground">{name}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => navigator.clipboard.writeText(name)}
                aria-label={`Copy ${name}`}
              >
                <Copy className="size-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
