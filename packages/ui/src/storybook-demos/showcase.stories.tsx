import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/accordion';
import { Alert, AlertDescription, AlertTitle } from '../components/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/alert-dialog';
import { AspectRatio } from '../components/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import { Calendar } from '../components/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/card';
import { Checkbox } from '../components/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../components/drawer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/dropdown-menu';
import { Input } from '../components/input';
import { Label } from '../components/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import { Progress } from '../components/progress';
import { RadioGroup, RadioGroupItem } from '../components/radio-group';
import { ScrollArea } from '../components/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/select';
import { Separator } from '../components/separator';
import { Skeleton } from '../components/skeleton';
import { Slider } from '../components/slider';
import { Switch } from '../components/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/tabs';
import { Textarea } from '../components/textarea';
import { Toggle } from '../components/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/tooltip';
import { EmptyState } from '../components/empty-state';
import { Kbd } from '../components/kbd';
import { ResizableSplit } from '../components/resizable-split';
import { SegmentedControl } from '../components/segmented-control';
import { Spinner } from '../components/spinner';
import { Stepper } from '../components/stepper';
import { Terminal, AlertCircle, Bold, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

const meta: Meta = { title: 'Demos/Showcase', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap items-start gap-2">{children}</div>
    </div>
  );
}

export const AllComponents: Story = {
  name: 'All Components',
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [seg, setSeg] = useState('day');
    const [step, setStep] = useState(5);
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background p-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Pixler UI — Showcase</h1>
          <p className="mb-10 text-sm text-muted-foreground">Every M03 component across all variants. Use the toolbar to switch color schemes and dark/light mode.</p>

          <div className="space-y-10">
            {/* Actions */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Actions</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="Button — variants">
                  {(['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'] as const).map((v) => (
                    <Button key={v} variant={v} size="sm">{v}</Button>
                  ))}
                </Cell>
                <Cell label="Button — sizes">
                  {(['sm', 'default', 'lg'] as const).map((s) => (
                    <Button key={s} size={s}>Size {s}</Button>
                  ))}
                </Cell>
                <Cell label="Toggle">
                  <Toggle aria-label="Bold"><Bold className="size-4" /></Toggle>
                  <Toggle variant="outline" aria-label="Bold outline"><Bold className="size-4" /></Toggle>
                </Cell>
              </div>
            </section>

            {/* Forms */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Forms</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="Input">
                  <Input placeholder="Enter text…" className="w-48" />
                  <Input disabled placeholder="Disabled" className="w-48" />
                </Cell>
                <Cell label="Textarea">
                  <Textarea placeholder="Write something…" className="w-48 h-20" />
                </Cell>
                <Cell label="Checkbox + Switch">
                  <div className="flex items-center gap-2"><Checkbox id="c1" /><Label htmlFor="c1">Option</Label></div>
                  <div className="flex items-center gap-2"><Switch id="s1" /><Label htmlFor="s1">Toggle</Label></div>
                </Cell>
                <Cell label="Select">
                  <Select>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Pick one" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                    </SelectContent>
                  </Select>
                </Cell>
                <Cell label="Slider">
                  <Slider defaultValue={[40]} max={100} className="w-40" />
                </Cell>
                <Cell label="Calendar (mini)">
                  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border border-border scale-75 origin-top-left" />
                </Cell>
              </div>
            </section>

            {/* Display */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Display</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="Badge — variants">
                  {(['default', 'secondary', 'outline', 'destructive'] as const).map((v) => (
                    <Badge key={v} variant={v}>{v}</Badge>
                  ))}
                </Cell>
                <Cell label="Avatar">
                  <Avatar><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>
                  <Avatar><AvatarFallback>MK</AvatarFallback></Avatar>
                </Cell>
                <Cell label="Skeleton">
                  <div className="space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-4 w-36" /></div>
                </Cell>
                <Cell label="Progress">
                  <div className="w-full space-y-2">
                    <Progress value={25} /><Progress value={60} /><Progress value={100} />
                  </div>
                </Cell>
                <Cell label="Card">
                  <Card className="w-52">
                    <CardHeader><CardTitle className="text-sm">Card title</CardTitle></CardHeader>
                    <CardContent><p className="text-xs text-muted-foreground">Card body.</p></CardContent>
                  </Card>
                </Cell>
                <Cell label="Aspect Ratio">
                  <div className="w-40">
                    <AspectRatio ratio={16 / 9} className="bg-muted rounded text-xs flex items-center justify-center text-muted-foreground">16:9</AspectRatio>
                  </div>
                </Cell>
              </div>
            </section>

            {/* Feedback */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Feedback</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="Alert">
                  <Alert className="w-80">
                    <Terminal className="size-4" /><AlertTitle>Info</AlertTitle>
                    <AlertDescription>Everything looks good.</AlertDescription>
                  </Alert>
                </Cell>
                <Cell label="Alert — destructive">
                  <Alert variant="destructive" className="w-80">
                    <AlertCircle className="size-4" /><AlertTitle>Error</AlertTitle>
                    <AlertDescription>Something went wrong.</AlertDescription>
                  </Alert>
                </Cell>
              </div>
            </section>

            {/* Navigation */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Navigation</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="Tabs">
                  <Tabs defaultValue="a" className="w-64">
                    <TabsList><TabsTrigger value="a">Tab A</TabsTrigger><TabsTrigger value="b">Tab B</TabsTrigger></TabsList>
                    <TabsContent value="a"><p className="text-xs p-2 text-muted-foreground">Panel A</p></TabsContent>
                    <TabsContent value="b"><p className="text-xs p-2 text-muted-foreground">Panel B</p></TabsContent>
                  </Tabs>
                </Cell>
                <Cell label="Pagination">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                      <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                      <PaginationItem><PaginationNext href="#" /></PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </Cell>
              </div>
            </section>

            {/* Overlay */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Overlay</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="Dialog">
                  <Dialog>
                    <DialogTrigger asChild><Button variant="outline" size="sm">Open dialog</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Dialog</DialogTitle></DialogHeader></DialogContent>
                  </Dialog>
                </Cell>
                <Cell label="Drawer">
                  <Drawer>
                    <DrawerTrigger asChild><Button variant="outline" size="sm">Open drawer</Button></DrawerTrigger>
                    <DrawerContent><DrawerHeader><DrawerTitle>Drawer</DrawerTitle></DrawerHeader></DrawerContent>
                  </Drawer>
                </Cell>
                <Cell label="AlertDialog">
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Confirm</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Cell>
                <Cell label="Dropdown">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Menu</Button></DropdownMenuTrigger>
                    <DropdownMenuContent><DropdownMenuItem>Item 1</DropdownMenuItem><DropdownMenuItem>Item 2</DropdownMenuItem></DropdownMenuContent>
                  </DropdownMenu>
                </Cell>
                <Cell label="Popover">
                  <Popover>
                    <PopoverTrigger asChild><Button variant="outline" size="sm">Popover</Button></PopoverTrigger>
                    <PopoverContent className="w-48"><p className="text-sm">Popover content.</p></PopoverContent>
                  </Popover>
                </Cell>
                <Cell label="Tooltip">
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="outline" size="sm">Hover me</Button></TooltipTrigger>
                    <TooltipContent>Tooltip text</TooltipContent>
                  </Tooltip>
                </Cell>
              </div>
            </section>

            {/* Data */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Data</h2>
              <div className="grid gap-6">
                <Cell label="Table">
                  <Table className="w-full max-w-lg">
                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader>
                    <TableBody>
                      <TableRow><TableCell>Invoice #001</TableCell><TableCell><Badge>Paid</Badge></TableCell><TableCell>$250</TableCell></TableRow>
                      <TableRow><TableCell>Invoice #002</TableCell><TableCell><Badge variant="secondary">Pending</Badge></TableCell><TableCell>$150</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </Cell>
                <Cell label="Command">
                  <Command className="rounded-lg border border-border w-64">
                    <CommandInput placeholder="Search…" />
                    <CommandList><CommandEmpty>No results.</CommandEmpty><CommandGroup heading="Quick"><CommandItem>Dashboard</CommandItem><CommandItem>Settings</CommandItem></CommandGroup></CommandList>
                  </Command>
                </Cell>
              </div>
            </section>

            {/* Layout */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Layout</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="Accordion">
                  <Accordion type="single" collapsible className="w-72">
                    <AccordionItem value="a"><AccordionTrigger>Question 1</AccordionTrigger><AccordionContent>Answer 1</AccordionContent></AccordionItem>
                    <AccordionItem value="b"><AccordionTrigger>Question 2</AccordionTrigger><AccordionContent>Answer 2</AccordionContent></AccordionItem>
                  </Accordion>
                </Cell>
                <Cell label="Collapsible">
                  <Collapsible className="w-48">
                    <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium">
                      Toggle <ChevronsUpDown className="size-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2 text-sm text-muted-foreground">Hidden content revealed.</CollapsibleContent>
                  </Collapsible>
                </Cell>
                <Cell label="Separator">
                  <div className="w-48 space-y-2"><p className="text-sm">Above</p><Separator /><p className="text-sm">Below</p></div>
                </Cell>
                <Cell label="ScrollArea">
                  <ScrollArea className="h-24 w-40 rounded-md border border-border p-2">
                    {Array.from({ length: 10 }, (_, i) => <p key={i} className="text-xs py-0.5">Item {i + 1}</p>)}
                  </ScrollArea>
                </Cell>
              </div>
            </section>

            {/* Pixler-specific */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Pixler-specific</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="EmptyState">
                  <EmptyState icon={Terminal} title="No agents running" body="Start a workspace to see agent activity." action={<Button size="sm">New workspace</Button>} className="w-72" />
                </Cell>
                <Cell label="Spinner">
                  <Spinner className="size-4 text-muted-foreground" />
                  <Spinner className="size-6 text-primary" />
                  <Spinner className="size-8 text-destructive" />
                </Cell>
                <Cell label="Kbd">
                  <div className="flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></div>
                  <div className="flex gap-1"><Kbd>⇧</Kbd><Kbd>⌘</Kbd><Kbd>P</Kbd></div>
                </Cell>
                <Cell label="Stepper">
                  <Stepper value={step} onChange={setStep} min={0} max={20} className="w-36" />
                </Cell>
                <Cell label="SegmentedControl">
                  <SegmentedControl value={seg} onChange={setSeg} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
                </Cell>
                <Cell label="ResizableSplit">
                  <div className="h-24 w-64 rounded-md border border-border overflow-hidden">
                    <ResizableSplit direction="horizontal">
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground bg-muted/30">L</div>
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">R</div>
                    </ResizableSplit>
                  </div>
                </Cell>
              </div>
            </section>

            {/* Compositions */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Compositions (Combobox, Date Picker, Searchbox)</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Cell label="Combobox (Popover + Command)">
                  <Popover>
                    <PopoverTrigger asChild><Button variant="outline" size="sm">Pick a fruit…</Button></PopoverTrigger>
                    <PopoverContent className="w-56 p-0">
                      <Command><CommandInput placeholder="Search…" /><CommandList><CommandEmpty>None found.</CommandEmpty><CommandGroup><CommandItem>Apple</CommandItem><CommandItem>Banana</CommandItem></CommandGroup></CommandList></Command>
                    </PopoverContent>
                  </Popover>
                </Cell>
                <Cell label="Date Picker (Popover + Calendar)">
                  <Popover>
                    <PopoverTrigger asChild><Button variant="outline" size="sm">Pick a date</Button></PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>
                  </Popover>
                </Cell>
                <Cell label="Searchbox (Input + Command)">
                  <div className="relative w-56">
                    <Input placeholder="Search…" className="pl-8" />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
                  </div>
                </Cell>
              </div>
            </section>

            {/* Not yet ported */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Not yet ported from lazar_2026</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Color Picker · Comment box · File Input · Legend Indicator · List Group · Mega Menu · Navbar ·
                Placeholder Image · Price · Ratings · Strong Password · Time Picker · Toggle Count ·
                Toggle Password · Tree
              </p>
            </section>
          </div>
        </div>
      </TooltipProvider>
    );
  },
};
