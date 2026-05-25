import { Input } from '@pixler/ui/components/input';
import { Label } from '@pixler/ui/components/label';
import { Separator } from '@pixler/ui/components/separator';
import { Switch } from '@pixler/ui/components/switch';
import { SegmentedControl } from '@pixler/ui/components/segmented-control';
import type { SegmentedOption } from '@pixler/ui/components/segmented-control';
import { useSetting } from '../../hooks/useSetting';

type CursorStyle = 'block' | 'underline' | 'bar';

const CURSOR_OPTIONS: SegmentedOption<CursorStyle>[] = [
  { value: 'block', label: 'Block' },
  { value: 'underline', label: 'Underline' },
  { value: 'bar', label: 'Bar' },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function TerminalPanel() {
  const { value: shell = '', set: setShell } = useSetting<string>('terminal.shell');
  const { value: fontFamily = '', set: setFontFamily } = useSetting<string>('terminal.fontFamily');
  const { value: fontSize = 13, set: setFontSize } = useSetting<number>('terminal.fontSize');
  const { value: cursorStyle = 'block', set: setCursorStyle } = useSetting<CursorStyle>('terminal.cursorStyle');
  const { value: scrollback = 5000, set: setScrollback } = useSetting<number>('terminal.scrollback');
  const { value: copyOnSelect = false, set: setCopyOnSelect } = useSetting<boolean>('terminal.copyOnSelect');
  const { value: pasteWarning = true, set: setPasteWarning } = useSetting<boolean>('terminal.pasteWarning');

  return (
    <div className="space-y-6">
      <Section label="Shell">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Shell path (leave blank to use $SHELL)</Label>
          <Input
            value={shell}
            onChange={(e) => setShell(e.target.value)}
            placeholder="/bin/zsh"
            className="h-8 font-mono text-sm"
          />
        </div>
      </Section>

      <Separator />

      <Section label="Appearance">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Font family</Label>
          <Input
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            placeholder="JetBrains Mono, Menlo, monospace"
            className="h-8 font-mono text-sm"
          />
        </div>
        <Row label="Font size">
          <Input
            type="number"
            value={fontSize}
            min={8}
            max={32}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="h-8 w-20 text-sm"
          />
        </Row>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Cursor style</Label>
          <SegmentedControl
            options={CURSOR_OPTIONS}
            value={cursorStyle}
            onChange={setCursorStyle}
            className="h-7"
          />
        </div>
      </Section>

      <Separator />

      <Section label="Behaviour">
        <Row label="Scrollback lines">
          <Input
            type="number"
            value={scrollback}
            min={100}
            max={50000}
            step={500}
            onChange={(e) => setScrollback(Number(e.target.value))}
            className="h-8 w-24 text-sm"
          />
        </Row>
        <Row label="Copy on select">
          <Switch checked={copyOnSelect} onCheckedChange={setCopyOnSelect} />
        </Row>
        <Row label="Paste warning">
          <Switch checked={pasteWarning} onCheckedChange={setPasteWarning} />
        </Row>
      </Section>
    </div>
  );
}
