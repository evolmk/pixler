import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/button';
import { Badge } from '../components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/card';
import { Input } from '../components/input';
import { Label } from '../components/label';
import { Textarea } from '../components/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/select';
import { Checkbox } from '../components/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/radio-group';
import { Separator } from '../components/separator';
import { Slider } from '../components/slider';
import { Switch } from '../components/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import { Spinner } from '../components/spinner';
import { Stepper } from '../components/stepper';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/pagination';
import { Mic, Plus, Send, Globe, Paperclip, Info, Star, ArrowLeft, Archive, BellOff, Snooze, MoreHorizontal, Search, Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const meta: Meta = { title: 'Demos/Shadcn-case', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

// ── Column 1 ──────────────────────────────────────────────────────

function PaymentMethodCard() {
  const [sameAddress, setSameAddress] = useState(false);
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Payment Method</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5"><Label>Name on card</Label><Input placeholder="John Smith" /></div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 space-y-1.5"><Label>Card number</Label><Input placeholder="0000 0000 0000 0000" /></div>
          <div className="space-y-1.5"><Label>CVV</Label><Input placeholder="123" /></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label>Month</Label>
            <Select><SelectTrigger><SelectValue placeholder="MM" /></SelectTrigger><SelectContent>{Array.from({ length: 12 }, (_, i) => <SelectItem key={i} value={String(i + 1).padStart(2, '0')}>{String(i + 1).padStart(2, '0')}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-1.5">
            <Label>Year</Label>
            <Select><SelectTrigger><SelectValue placeholder="YYYY" /></SelectTrigger><SelectContent>{[2025, 2026, 2027, 2028, 2029].map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select>
          </div>
        </div>
        <Separator />
        <p className="text-xs font-medium text-foreground">Billing Address</p>
        <div className="flex items-center gap-2">
          <Checkbox id="same" checked={sameAddress} onCheckedChange={(v) => setSameAddress(!!v)} />
          <Label htmlFor="same">Same as shipping address</Label>
        </div>
        <div className="space-y-1.5"><Label>Comments</Label><Textarea placeholder="Optional note…" rows={2} /></div>
        <div className="flex gap-2 pt-1">
          <Button className="flex-1">Submit</Button>
          <Button variant="ghost" className="flex-1">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Column 2 ──────────────────────────────────────────────────────

function EmptyTeamCard() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-8">
        <div className="flex -space-x-2">
          {['AB', 'CD', 'EF'].map((f) => (
            <Avatar key={f} className="size-8 border-2 border-background">
              <AvatarFallback className="text-xs">{f}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">No Team Members</p>
          <p className="text-xs text-muted-foreground mt-0.5">Invite your team to collaborate.</p>
        </div>
        <Button size="sm"><Plus className="size-3.5 mr-1" />Invite Members</Button>
      </CardContent>
    </Card>
  );
}

function StatusBadges() {
  return (
    <div className="flex flex-col gap-2">
      {[
        { label: 'Syncing', color: 'text-status-info' },
        { label: 'Updating', color: 'text-status-warning' },
        { label: 'Loading', color: 'text-muted-foreground' },
      ].map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <Spinner className={`size-4 ${color}`} />
          <span className="text-sm text-foreground">{label}</span>
          <Badge variant="secondary" className="ml-auto text-xs">{label}</Badge>
        </div>
      ))}
    </div>
  );
}

function MessageComposer() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 h-10">
      <Plus className="size-4 text-muted-foreground shrink-0" />
      <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Send a message…" />
      <Mic className="size-4 text-muted-foreground shrink-0" />
    </div>
  );
}

function PriceRangeSlider() {
  const [value, setValue] = useState([200, 800]);
  return (
    <div className="space-y-2">
      <Label>Price Range</Label>
      <Slider value={value} onValueChange={setValue} min={0} max={1000} step={10} />
      <p className="text-xs text-muted-foreground">Set your budget range (${value[0]} – ${value[1]}).</p>
    </div>
  );
}

function SearchboxResult() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 h-10">
      <Search className="size-4 text-muted-foreground shrink-0" />
      <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search…" />
      <span className="text-xs text-muted-foreground shrink-0">12 results</span>
    </div>
  );
}

function UrlInputAddon() {
  return (
    <div className="flex rounded-md border border-input overflow-hidden h-10">
      <span className="flex items-center bg-muted px-3 text-xs text-muted-foreground border-r border-input">https://</span>
      <input className="flex-1 bg-background px-3 text-sm outline-none placeholder:text-muted-foreground" placeholder="example.com" />
      <span className="flex items-center px-2"><Info className="size-4 text-muted-foreground" /></span>
    </div>
  );
}

function AskSearchChatTextarea() {
  return (
    <div className="rounded-lg border border-input bg-background p-3 space-y-2">
      <Textarea placeholder="Ask, search, or make anything…" rows={3} className="border-0 p-0 resize-none shadow-none focus-visible:ring-0" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">+ Auto</Badge>
          <span className="text-xs text-muted-foreground">52% used</span>
        </div>
        <Button size="icon" className="size-8 rounded-full"><Send className="size-3.5" /></Button>
      </div>
    </div>
  );
}

function UsernameConfirmed() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 h-10">
      <input readOnly value="@shadcn" className="flex-1 bg-transparent text-sm outline-none" />
      <Check className="size-4 text-brand shrink-0" />
    </div>
  );
}

// ── Column 3 ──────────────────────────────────────────────────────

function UrlBarInput() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 h-10">
      <Info className="size-4 text-muted-foreground shrink-0" />
      <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="https://pixler.dev" />
      <Star className="size-4 text-muted-foreground shrink-0" />
    </div>
  );
}

function TwoFactorCard() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4 px-5">
        <div>
          <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
          <p className="text-xs text-muted-foreground">Add an extra layer of security.</p>
        </div>
        <Button size="sm">Enable</Button>
      </CardContent>
    </Card>
  );
}

function ProfileVerifiedRow() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-3 px-5">
        <div className="flex items-center gap-2">
          <Check className="size-4 text-status-success" />
          <p className="text-sm text-foreground">Your profile has been verified.</p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

function SectionSeparatorLabel() {
  return (
    <div className="relative">
      <Separator />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground whitespace-nowrap">Appearance Settings</span>
    </div>
  );
}

function ComputeEnvironmentRadio() {
  const [env, setEnv] = useState('kubernetes');
  return (
    <RadioGroup value={env} onValueChange={setEnv} className="space-y-2">
      {[
        { value: 'kubernetes', label: 'Kubernetes', desc: 'Managed container orchestration', available: true },
        { value: 'vm', label: 'Virtual Machine', desc: 'Coming soon', available: false },
      ].map((opt) => (
        <label key={opt.value} className={`relative flex cursor-pointer rounded-lg border p-4 transition-colors ${env === opt.value ? 'border-primary bg-primary/5' : 'border-border'} ${!opt.available ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{opt.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
          </div>
          <RadioGroupItem value={opt.value} className="mt-0.5" disabled={!opt.available} />
        </label>
      ))}
    </RadioGroup>
  );
}

function GpuStepper() {
  const [gpus, setGpus] = useState(8);
  return (
    <div className="space-y-1.5">
      <Label>Number of GPUs</Label>
      <Stepper value={gpus} onChange={setGpus} min={1} max={16} className="w-36" />
      <p className="text-xs text-muted-foreground">You can add more later.</p>
    </div>
  );
}

function WallpaperTintingRow() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label>Wallpaper Tinting</Label>
        <p className="text-xs text-muted-foreground">Apply color scheme to wallpaper.</p>
      </div>
      <Switch defaultChecked />
    </div>
  );
}

// ── Column 4 ──────────────────────────────────────────────────────

function AddContextInput() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 h-10">
      <span className="text-sm text-muted-foreground">@</span>
      <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Add context…" />
    </div>
  );
}

function AskSearchComposer() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-input bg-background px-4 h-11">
      <Paperclip className="size-4 text-muted-foreground shrink-0" />
      <Globe className="size-4 text-muted-foreground shrink-0" />
      <input className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Ask, search, or make anything…" />
      <Button size="icon" className="size-7 rounded-full shrink-0"><Send className="size-3" /></Button>
    </div>
  );
}

function PillToolbar() {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="size-8"><ArrowLeft className="size-4" /></Button>
      <div className="flex gap-1 ml-2">
        {['Archive', 'Report', 'Snooze'].map((label) => (
          <Button key={label} variant="outline" size="sm">{label === 'Archive' ? <><Archive className="size-3.5 mr-1" />{label}</> : label === 'Snooze' ? <><Snooze className="size-3.5 mr-1" />{label}</> : label}</Button>
        ))}
      </div>
      <Button variant="ghost" size="icon" className="size-8 ml-auto"><MoreHorizontal className="size-4" /></Button>
    </div>
  );
}

function AgreeTermsRow() {
  const [agreed, setAgreed] = useState(false);
  return (
    <label className={`flex items-center gap-3 rounded-md px-4 py-3 cursor-pointer transition-colors ${agreed ? 'bg-primary/10 border border-primary' : 'border border-border'}`}>
      <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} />
      <span className="text-sm text-foreground">I agree to the terms and conditions</span>
    </label>
  );
}

function PaginationWithSelect() {
  return (
    <div className="flex items-center gap-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
      <Select defaultValue="copilot">
        <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="copilot">Copilot</SelectItem><SelectItem value="claude">Claude</SelectItem></SelectContent>
      </Select>
    </div>
  );
}

function HowHeardRadio() {
  const [v, setV] = useState('social');
  const opts = [
    { value: 'social', label: 'Social Media' },
    { value: 'search', label: 'Search Engine' },
    { value: 'referral', label: 'Referral' },
    { value: 'other', label: 'Other' },
  ];
  return (
    <div className="space-y-1.5">
      <Label>How did you hear about us?</Label>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={o.value}
            onClick={() => setV(o.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${v === o.value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary/50'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadingStateCard() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-8">
        <Spinner className="size-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Processing your request</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Please wait while we process your request. Do not refresh the page.</p>
        </div>
        <Button variant="outline" size="sm">Cancel</Button>
      </CardContent>
    </Card>
  );
}

export const Blocks: Story = {
  name: 'Blocks',
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Shadcn-case</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-world recipe cards composed from M03 primitives.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Column 1 */}
        <div className="space-y-4">
          <PaymentMethodCard />
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <EmptyTeamCard />
          <Card><CardContent className="py-4 px-5"><StatusBadges /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><MessageComposer /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><PriceRangeSlider /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><SearchboxResult /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><UrlInputAddon /></CardContent></Card>
          <AskSearchChatTextarea />
          <Card><CardContent className="py-4 px-5"><UsernameConfirmed /></CardContent></Card>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <Card><CardContent className="py-4 px-5"><UrlBarInput /></CardContent></Card>
          <TwoFactorCard />
          <ProfileVerifiedRow />
          <Card><CardContent className="py-5 px-5"><SectionSeparatorLabel /></CardContent></Card>
          <Card><CardContent className="py-4 px-5 space-y-4"><ComputeEnvironmentRadio /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><GpuStepper /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><WallpaperTintingRow /></CardContent></Card>
        </div>

        {/* Column 4 */}
        <div className="space-y-4">
          <Card><CardContent className="py-4 px-5"><AddContextInput /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><AskSearchComposer /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><PillToolbar /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><AgreeTermsRow /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><PaginationWithSelect /></CardContent></Card>
          <Card><CardContent className="py-4 px-5"><HowHeardRadio /></CardContent></Card>
          <LoadingStateCard />
        </div>
      </div>
    </div>
  ),
};
