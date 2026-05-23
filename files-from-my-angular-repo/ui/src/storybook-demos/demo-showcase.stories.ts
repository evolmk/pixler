// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';

// ── Actions & Controls ────────────────────────────────────────────────────────
import { ButtonComponent } from '../components/button/button.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { ToggleComponent } from '../components/toggle/toggle.component';
import { ToggleGroupComponent, ToggleGroupItemComponent } from '../components/toggle-group/toggle-group.component';
import { ToggleCountComponent } from '../components/toggle-count/toggle-count.component';
import { SegmentedComponent } from '../components/segmented/segmented.component';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';

// ── Form Inputs ───────────────────────────────────────────────────────────────
import { LabelComponent } from '../components/label/label.directive';
import { InputComponent } from '../components/input/input.component';
import { InputGroupComponent, InputAddonComponent } from '../components/input-group/input-group.component';
import { InputNumberComponent } from '../components/input-number/input-number.component';
import { TextareaComponent } from '../components/textarea/textarea.component';
import { CheckboxComponent } from '../components/checkbox/checkbox.component';
import { SwitchComponent } from '../components/switch/switch.component';
import { RadioGroupComponent, RadioGroupItemComponent } from '../components/radio-group/radio-group.component';
import { SliderComponent } from '../components/slider/slider.component';
import {
  SelectComponent,
  SelectTriggerComponent,
  SelectValueComponent,
  SelectContentComponent,
  SelectGroupComponent,
  SelectLabelComponent,
  SelectItemComponent,
  SelectSeparatorComponent,
} from '../components/select/select.component';
import { ComboboxComponent } from '../components/combobox/combobox.component';
import { SearchboxComponent } from '../components/searchbox/searchbox.component';
import {
  FormFieldComponent,
  FormControlComponent,
  FormMessageComponent,
} from '../components/form-field/form-field.component';
import { InputPinComponent } from '../components/input-pin/input-pin.component';
import { TogglePasswordComponent } from '../components/toggle-password/toggle-password.component';
import { StrongPasswordComponent } from '../components/strong-password/strong-password.component';
import { FileInputComponent } from '../components/file-input/file-input.component';
import { RatingsComponent } from '../components/ratings/ratings.component';
import { ColorPickerComponent } from '../components/color-picker/color-picker.component';
import { TimePickerComponent } from '../components/time-picker/time-picker.component';
import { DatePickerComponent } from '../components/date-picker/date-picker.component';

// ── Feedback & Status ─────────────────────────────────────────────────────────
import { AlertComponent, AlertTitleComponent, AlertDescriptionComponent } from '../components/alert/alert.component';
import { ProgressComponent } from '../components/progress/progress.component';
import { SkeletonComponent } from '../components/skeleton/skeleton.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { ToasterComponent } from '../components/toast/toaster.component';
import { toast } from '../components/toast/toast.function';
import { StateComponent } from '../components/state/state.component';

// ── Display Primitives ────────────────────────────────────────────────────────
import {
  AvatarComponent,
  AvatarImageComponent,
  AvatarFallbackComponent,
  AvatarGroupComponent,
} from '../components/avatar/avatar.component';
import { SeparatorComponent } from '../components/separator/separator.component';
import { DividerComponent } from '../components/divider/divider.component';
import { KbdComponent } from '../components/kbd/kbd.component';
import { LegendIndicatorComponent } from '../components/legend-indicator/legend-indicator.component';
import { IconStyledComponent } from '../components/icon-styled/icon-styled.component';
import { BlockquoteComponent } from '../components/blockquote/blockquote.component';
import { AspectRatioComponent } from '../components/aspect-ratio/aspect-ratio.component';
import { ProseComponent } from '../components/prose/prose.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
} from '../components/card/card.component';

// ── Overlays & Popups ─────────────────────────────────────────────────────────
import {
  TooltipComponent,
  TooltipContentComponent,
  TooltipTriggerDirective,
} from '../components/tooltip/tooltip.component';
import { TooltipDirective } from '../directives/tooltip.directive';
import {
  PopoverComponent,
  PopoverContentComponent,
  PopoverTriggerDirective,
} from '../components/popover/popover.component';
import {
  HoverCardComponent,
  HoverCardContentComponent,
  HoverCardTriggerDirective,
} from '../components/hover-card/hover-card.component';
import {
  DropdownComponent,
  DropdownTriggerDirective,
  DropdownContentDirective,
  DropdownItemComponent,
  DropdownGroupComponent,
  DropdownLabelComponent,
  DropdownSeparatorComponent,
  DropdownShortcutComponent,
} from '../components/dropdown/dropdown.component';
import {
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ContextMenuContentComponent,
  ContextMenuGroupComponent,
  ContextMenuLabelComponent,
  ContextMenuItemComponent,
  ContextMenuSeparatorComponent,
} from '../components/context-menu/context-menu.component';
import {
  DialogComponent,
  DialogContentComponent,
  DialogHeaderComponent,
  DialogFooterComponent,
  DialogBodyComponent,
  DialogTitleComponent,
  DialogDescriptionComponent,
  DialogTriggerDirective,
  DialogCloseDirective,
} from '../components/dialog/dialog.component';
import { DialogActionDirective, DialogCancelDirective } from '../components/dialog/dialog.component';
import {
  DrawerComponent,
  DrawerTriggerDirective,
  DrawerCloseDirective,
  DrawerContentComponent,
  DrawerHeaderComponent,
  DrawerFooterComponent,
  DrawerTitleComponent,
  DrawerDescriptionComponent,
} from '../components/drawer/drawer.component';

// ── Navigation & Structure ────────────────────────────────────────────────────
import {
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkDirective,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
} from '../components/breadcrumb/breadcrumb.component';
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
} from '../components/accordion/accordion.component';
import {
  CollapsibleComponent,
  CollapsibleTriggerDirective,
  CollapsibleContentComponent,
} from '../components/collapsible/collapsible.component';
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
} from '../components/tabs/tabs.component';
import { TreeComponent, TreeNodeComponent } from '../components/tree/tree.component';
import { ListGroupComponent, ListGroupItemComponent } from '../components/list-group/list-group.component';
import {
  PaginationComponent,
  PaginationContentComponent,
  PaginationItemComponent,
  PaginationLinkDirective,
  PaginationPreviousComponent,
  PaginationNextComponent,
  PaginationEllipsisComponent,
} from '../components/pagination/pagination.component';

// ── Navigation (full-width) ───────────────────────────────────────────────────
import {
  NavbarComponent,
  NavbarBrandComponent,
  NavbarNavComponent,
  NavbarItemComponent,
  NavbarActionsComponent,
} from '../components/navbar/navbar.component';
import {
  MenubarComponent,
  MenubarMenuComponent,
  MenubarTriggerComponent,
  MenubarContentComponent,
  MenubarItemComponent,
  MenubarSeparatorComponent,
  MenubarLabelComponent,
  MenubarShortcutComponent,
} from '../components/menubar/menubar.component';
import {
  NavigationMenuComponent,
  NavigationMenuListComponent,
  NavigationMenuItemComponent,
  NavigationMenuTriggerComponent,
  NavigationMenuContentComponent,
  NavigationMenuLinkDirective,
} from '../components/navigation-menu/navigation-menu.component';
import {
  MegaMenuComponent,
  MegaMenuItemComponent,
  MegaMenuTriggerDirective,
  MegaMenuContentComponent,
  MegaMenuSectionComponent,
  MegaMenuSectionTitleComponent,
  MegaMenuLinkComponent,
} from '../components/mega-menu/mega-menu.component';

// ── Data & Content ────────────────────────────────────────────────────────────
import { CalendarComponent } from '../components/calendar/calendar.component';
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
  CommandShortcutComponent,
} from '../components/command/command.component';
import {
  ChatBubbleComponent,
  ChatBubbleAvatarComponent,
  ChatBubbleContentComponent,
  ChatBubbleTimestampComponent,
} from '../components/chat-bubble/chat-bubble.component';
import {
  TimelineComponent,
  TimelineItemComponent,
  TimelineIconComponent,
  TimelineContentComponent,
} from '../components/timeline/timeline.component';
import { ScrollAreaComponent } from '../components/scroll-area/scroll-area.component';
import { ThemeSelectorComponent } from '../components/theme-selector/theme-selector.component';

// ── Layout & Wide ─────────────────────────────────────────────────────────────
import {
  CarouselComponent,
  CarouselContentComponent,
  CarouselItemComponent,
} from '../components/carousel/carousel.component';
import { CarouselCounterComponent } from '../components/carousel/carousel-nav.component';
import { StepperComponent } from '../components/stepper/stepper.component';
import {
  ResizableComponent,
  ResizablePanelComponent,
  ResizableHandleComponent,
} from '../components/resizable/resizable.component';
import {
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableFooterComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  TableCaptionComponent,
} from '../components/table/table.component';

// ── Utilities ─────────────────────────────────────────────────────────────────
import { placeholderImage } from '../utils/placeholder';

// ── Story data ────────────────────────────────────────────────────────────────

const COMBOBOX_OPTIONS = [
  { value: 'lzr2000', label: 'LZR-2000 Rotary', group: 'Rotary' },
  { value: 'lzr1500', label: 'LZR-1500 Rotary', group: 'Rotary' },
  { value: 'lzr800', label: 'LZR-800 Inline', group: 'Inline' },
  { value: 'lzr500', label: 'LZR-500 Inline', group: 'Inline' },
  { value: 'lzr200', label: 'LZR-200 Snap-On', group: 'Snap-On' },
];

const SEGMENTED_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const STEPPER_STEPS = [
  { title: 'Order Placed', description: 'Jan 10', status: 'completed' },
  { title: 'In Production', description: 'Jan 12', status: 'current' },
  { title: 'Quality Check', description: 'Pending', status: 'pending' },
  { title: 'Shipped', description: 'TBD', status: 'pending' },
];

const TABLE_DATA = [
  { id: 'ORD-4521', customer: 'Acme Corp', status: 'Shipped', amount: '$12,400' },
  { id: 'ORD-4520', customer: 'BevCo Industries', status: 'Processing', amount: '$8,200' },
  { id: 'ORD-4519', customer: 'PharmaLine Ltd', status: 'Delivered', amount: '$31,750' },
  { id: 'ORD-4518', customer: 'CosmetiCare', status: 'Cancelled', amount: '$5,900' },
  { id: 'ORD-4517', customer: 'NutriPack GmbH', status: 'Shipped', amount: '$14,300' },
];

const TABLE_COLUMNS = [
  { key: 'id', header: 'Order #', sortable: true, width: '120px' },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'amount', header: 'Amount', sortable: true },
];

const TREE_NODES = [
  {
    id: '1',
    label: 'Machines',
    icon: '🏭',
    children: [
      {
        id: '1-1',
        label: 'LZR-2000',
        icon: '⚙️',
        children: [
          { id: '1-1-1', label: 'Motor Assembly', icon: '🔧' },
          { id: '1-1-2', label: 'Control Panel', icon: '📟' },
        ],
      },
      { id: '1-2', label: 'LZR-800', icon: '⚙️' },
    ],
  },
  { id: '2', label: 'Inventory', icon: '📦', children: [{ id: '2-1', label: 'Spare Parts', icon: '🔩' }] },
];

// ── ALL IMPORTS ARRAY ─────────────────────────────────────────────────────────

const ALL_IMPORTS = [
  // Actions
  ButtonComponent,
  BadgeComponent,
  ToggleComponent,
  ToggleGroupComponent,
  ToggleGroupItemComponent,
  ToggleCountComponent,
  SegmentedComponent,
  ThemeToggleComponent,
  // Form
  LabelComponent,
  InputComponent,
  InputGroupComponent,
  InputAddonComponent,
  InputNumberComponent,
  TextareaComponent,
  CheckboxComponent,
  SwitchComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  SliderComponent,
  SelectComponent,
  SelectTriggerComponent,
  SelectValueComponent,
  SelectContentComponent,
  SelectGroupComponent,
  SelectLabelComponent,
  SelectItemComponent,
  SelectSeparatorComponent,
  ComboboxComponent,
  SearchboxComponent,
  FormFieldComponent,
  LabelComponent,
  FormControlComponent,
  FormMessageComponent,
  InputPinComponent,
  TogglePasswordComponent,
  StrongPasswordComponent,
  FileInputComponent,
  RatingsComponent,
  ColorPickerComponent,
  TimePickerComponent,
  DatePickerComponent,
  // Feedback
  AlertComponent,
  AlertTitleComponent,
  AlertDescriptionComponent,
  ProgressComponent,
  SkeletonComponent,
  SpinnerComponent,
  ToasterComponent,
  StateComponent,
  // Display
  AvatarComponent,
  AvatarImageComponent,
  AvatarFallbackComponent,
  AvatarGroupComponent,
  SeparatorComponent,
  DividerComponent,
  KbdComponent,
  LegendIndicatorComponent,
  IconStyledComponent,
  BlockquoteComponent,
  AspectRatioComponent,
  ProseComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
  // Overlays
  TooltipComponent,
  TooltipContentComponent,
  TooltipTriggerDirective,
  TooltipDirective,
  PopoverComponent,
  PopoverContentComponent,
  PopoverTriggerDirective,
  HoverCardComponent,
  HoverCardContentComponent,
  HoverCardTriggerDirective,
  DropdownComponent,
  DropdownTriggerDirective,
  DropdownContentDirective,
  DropdownItemComponent,
  DropdownGroupComponent,
  DropdownLabelComponent,
  DropdownSeparatorComponent,
  DropdownShortcutComponent,
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ContextMenuContentComponent,
  ContextMenuGroupComponent,
  ContextMenuLabelComponent,
  ContextMenuItemComponent,
  ContextMenuSeparatorComponent,
  DialogComponent,
  DialogContentComponent,
  DialogHeaderComponent,
  DialogFooterComponent,
  DialogBodyComponent,
  DialogTitleComponent,
  DialogDescriptionComponent,
  DialogTriggerDirective,
  DialogCloseDirective,
  DialogActionDirective,
  DialogCancelDirective,
  DrawerComponent,
  DrawerTriggerDirective,
  DrawerCloseDirective,
  DrawerContentComponent,
  DrawerHeaderComponent,
  DrawerFooterComponent,
  DrawerTitleComponent,
  DrawerDescriptionComponent,
  // Navigation
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkDirective,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
  CollapsibleComponent,
  CollapsibleTriggerDirective,
  CollapsibleContentComponent,
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
  TreeComponent,
  TreeNodeComponent,
  ListGroupComponent,
  ListGroupItemComponent,
  PaginationComponent,
  PaginationContentComponent,
  PaginationItemComponent,
  PaginationLinkDirective,
  PaginationPreviousComponent,
  PaginationNextComponent,
  PaginationEllipsisComponent,
  // Nav full-width
  NavbarComponent,
  NavbarBrandComponent,
  NavbarNavComponent,
  NavbarItemComponent,
  NavbarActionsComponent,
  MenubarComponent,
  MenubarMenuComponent,
  MenubarTriggerComponent,
  MenubarContentComponent,
  MenubarItemComponent,
  MenubarSeparatorComponent,
  MenubarLabelComponent,
  MenubarShortcutComponent,
  NavigationMenuComponent,
  NavigationMenuListComponent,
  NavigationMenuItemComponent,
  NavigationMenuTriggerComponent,
  NavigationMenuContentComponent,
  NavigationMenuLinkDirective,
  MegaMenuComponent,
  MegaMenuItemComponent,
  MegaMenuTriggerDirective,
  MegaMenuContentComponent,
  MegaMenuSectionComponent,
  MegaMenuSectionTitleComponent,
  MegaMenuLinkComponent,
  // Data & Content
  CalendarComponent,
  FileUploadComponent,
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandItemComponent,
  CommandShortcutComponent,
  ChatBubbleComponent,
  ChatBubbleAvatarComponent,
  ChatBubbleContentComponent,
  ChatBubbleTimestampComponent,
  TimelineComponent,
  TimelineItemComponent,
  TimelineIconComponent,
  TimelineContentComponent,
  ScrollAreaComponent,
  ThemeSelectorComponent,
  // Wide
  CarouselComponent,
  CarouselContentComponent,
  CarouselItemComponent,
  CarouselCounterComponent,
  StepperComponent,
  ResizableComponent,
  ResizablePanelComponent,
  ResizableHandleComponent,
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableFooterComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  TableCaptionComponent,
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Demos/Showcase',
  tags: ['!autodocs'],
};
export default meta;
type Story = StoryObj;

// ── Helpers ───────────────────────────────────────────────────────────────────

// ── Default ───────────────────────────────────────────────────────────────────

export const Showcase: Story = {
  name: 'Showcase',
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      comboboxOptions: COMBOBOX_OPTIONS,
      segmentedOptions: SEGMENTED_OPTIONS,
      selectOptions: [
        { value: 'lzr2000', label: 'LZR-2000' },
        { value: 'lzr1500', label: 'LZR-1500' },
        { value: 'lzr800', label: 'LZR-800' },
        { value: 'lzr400', label: 'LZR-400' },
      ],
      stepperSteps: STEPPER_STEPS,
      tableData: TABLE_DATA,
      tableColumns: TABLE_COLUMNS,
      treeNodes: TREE_NODES,
      // Toast — types
      toastFn: () => toast('Order Updated', { description: 'Changes saved successfully.' }),
      toastSuccess: () => toast.success('Machine Online', { description: 'LZR-2000 is running.' }),
      toastError: () => toast.error('Connection Failed', { description: 'Unable to reach controller.' }),
      toastWarning: () => toast.warning('Low Pressure', { description: 'Check supply line.' }),
      toastInfo: () => toast.info('Maintenance Due', { description: 'Service in 7 days.' }),
      toastLoading: () => toast.loading('Processing...', { description: 'Applying settings.' }),
      // Toast — variants
      toastDestructive: () =>
        toast.error('Critical Failure', { description: 'System halted.', variant: 'destructive' }),
      // Toast — with action
      toastAction: () =>
        toast('Part removed', {
          description: 'CAP-4521 deleted.',
          action: { label: 'Undo', onClick: () => toast.success('Restored') },
        }),
      // Toast — with close button
      toastClose: () => toast.info('Sync complete', { description: '42 records updated.', closeButton: true }),
      // Toast — progress bar
      toastProgressBar: () => toast.success('Uploaded', { description: 'File saved to storage.' }),
      // Toast — progress circle
      toastProgressCircle: () => toast.warning('Rate limit', { description: 'Approaching API quota.' }),
      // Toast — no rich colors
      toastPlain: () => toast('Plain notification', { description: 'No color styling.', richColors: false }),
      // Toast — all types rapid
      toastAll: () => {
        toast('Default message');
        setTimeout(() => toast.success('Success message'), 150);
        setTimeout(() => toast.error('Error message'), 300);
        setTimeout(() => toast.warning('Warning message'), 450);
        setTimeout(() => toast.info('Info message'), 600);
      },
      // Placeholder — sample dimensions/ratios
      placeholderSquare: placeholderImage({ width: 96, ratio: '1:1' }),
      placeholderWide: placeholderImage({ width: 160, ratio: '16:9', bg: '3b82f6', fg: 'ffffff', text: '16:9' }),
      placeholderStandard: placeholderImage({ width: 128, ratio: '4:3', bg: '8b5cf6', fg: 'ffffff', text: '4:3' }),
      placeholderPhoto: placeholderImage({ width: 144, ratio: '3:2', bg: 'f59e0b', fg: 'ffffff', text: '3:2' }),
    },
    template: `
      <ui-toaster />
      <div class="grid grid-cols-3 gap-4 p-6 bg-background">


        <!-- ══════════════════════════════════════════════════
             3-COL — Accordion
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Accordion</h3>
          <p class="mb-3 text-xs" style="color:#888">Vertically stacked expandable sections — default, card, and bordered variants.</p>
          <div class="flex flex-col gap-4">
            <div>
              <p class="mb-1 text-[10px] uppercase tracking-wide" style="color:#888">Default</p>
              <ui-accordion>
                <ui-accordion-item value="specs">
                  <ui-accordion-trigger>Technical Specs</ui-accordion-trigger>
                  <ui-accordion-content>Output speed: 300 CPM · Torque: 15 Nm</ui-accordion-content>
                </ui-accordion-item>
                <ui-accordion-item value="maint">
                  <ui-accordion-trigger>Maintenance</ui-accordion-trigger>
                  <ui-accordion-content>Service interval: every 500 hours.</ui-accordion-content>
                </ui-accordion-item>
              </ui-accordion>
            </div>
            <div>
              <p class="mb-1 text-[10px] uppercase tracking-wide" style="color:#888">Card</p>
              <ui-accordion variant="card">
                <ui-accordion-item value="specs">
                  <ui-accordion-trigger>Technical Specs</ui-accordion-trigger>
                  <ui-accordion-content>Output speed: 300 CPM · Torque: 15 Nm</ui-accordion-content>
                </ui-accordion-item>
                <ui-accordion-item value="maint">
                  <ui-accordion-trigger>Maintenance</ui-accordion-trigger>
                  <ui-accordion-content>Service interval: every 500 hours.</ui-accordion-content>
                </ui-accordion-item>
              </ui-accordion>
            </div>
            <div>
              <p class="mb-1 text-[10px] uppercase tracking-wide" style="color:#888">Bordered</p>
              <ui-accordion variant="bordered">
                <ui-accordion-item value="specs">
                  <ui-accordion-trigger>Technical Specs</ui-accordion-trigger>
                  <ui-accordion-content>Output speed: 300 CPM · Torque: 15 Nm</ui-accordion-content>
                </ui-accordion-item>
                <ui-accordion-item value="maint">
                  <ui-accordion-trigger>Maintenance</ui-accordion-trigger>
                  <ui-accordion-content>Service interval: every 500 hours.</ui-accordion-content>
                </ui-accordion-item>
              </ui-accordion>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Alert
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Alert</h3>
          <p class="mb-3 text-xs" style="color:#888">Inline message block for informational, warning, and error feedback.</p>
          <div class="space-y-2">
            <ui-alert>
              <ui-alert-title>Default</ui-alert-title>
              <ui-alert-description>Maintenance window starts at 14:00.</ui-alert-description>
            </ui-alert>
            <ui-alert variant="success">
              <ui-alert-title>Machine Online</ui-alert-title>
              <ui-alert-description>LZR-2000 is running normally.</ui-alert-description>
            </ui-alert>
            <ui-alert variant="info">
              <ui-alert-title>Maintenance Due</ui-alert-title>
              <ui-alert-description>Service scheduled in 7 days.</ui-alert-description>
            </ui-alert>
            <ui-alert variant="warning">
              <ui-alert-title>Low Pressure</ui-alert-title>
              <ui-alert-description>Check supply line immediately.</ui-alert-description>
            </ui-alert>
            <ui-alert variant="destructive">
              <ui-alert-title>Connection Lost</ui-alert-title>
              <ui-alert-description>Unable to reach machine controller.</ui-alert-description>
            </ui-alert>
            <ui-alert variant="soft">
              <ui-alert-title>Note</ui-alert-title>
              <ui-alert-description>Settings will apply on next restart.</ui-alert-description>
            </ui-alert>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Aspect Ratio
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Aspect Ratio</h3>
          <p class="mb-3 text-xs" style="color:#888">Locks child content to a specified width-to-height ratio.</p>
          <ui-aspect-ratio [ratio]="16/9">
            <div class="h-full w-full rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">16 / 9</div>
          </ui-aspect-ratio>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Avatar
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Avatar</h3>
          <p class="mb-3 text-xs" style="color:#888">User photo with fallback initials and group stacking support.</p>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <ui-avatar uiTooltip="Mike" uiTooltipPlacement="top" class="transition-transform hover:scale-110">
                <ui-avatar-image src="https://i.pravatar.cc/40?img=1" alt="Mike" />
                <ui-avatar-fallback>MK</ui-avatar-fallback>
              </ui-avatar>
              <ui-avatar uiTooltip="Christian" uiTooltipPlacement="top" class="transition-transform hover:scale-110">
                <ui-avatar-fallback>CR</ui-avatar-fallback>
              </ui-avatar>
            </div>
            <ui-avatar-group [max]="3">
              <ui-avatar uiTooltip="Alice" uiTooltipPlacement="top" class="transition-transform hover:-translate-x-1 hover:scale-110"><ui-avatar-image src="https://i.pravatar.cc/40?img=2" /><ui-avatar-fallback>A</ui-avatar-fallback></ui-avatar>
              <ui-avatar uiTooltip="Bob" uiTooltipPlacement="top" class="transition-transform hover:-translate-x-1 hover:scale-110"><ui-avatar-image src="https://i.pravatar.cc/40?img=3" /><ui-avatar-fallback>B</ui-avatar-fallback></ui-avatar>
              <ui-avatar uiTooltip="Carol" uiTooltipPlacement="top" class="transition-transform hover:-translate-x-1 hover:scale-110"><ui-avatar-image src="https://i.pravatar.cc/40?img=4" /><ui-avatar-fallback>C</ui-avatar-fallback></ui-avatar>
              <ui-avatar uiTooltip="Diana" uiTooltipPlacement="top" class="transition-transform hover:-translate-x-1 hover:scale-110"><ui-avatar-fallback>D</ui-avatar-fallback></ui-avatar>
            </ui-avatar-group>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Badge
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Badge</h3>
          <p class="mb-3 text-xs" style="color:#888">Small label for status, category, or count indicators.</p>
          <div class="flex flex-wrap gap-2 mb-2">
            <ui-badge>Default</ui-badge>
            <ui-badge variant="secondary">Secondary</ui-badge>
            <ui-badge variant="destructive">Destructive</ui-badge>
            <ui-badge variant="outline">Outline</ui-badge>
            <ui-badge variant="success">Success</ui-badge>
            <ui-badge variant="warning">Warning</ui-badge>
            <ui-badge variant="info">Info</ui-badge>
          </div>
          <div class="flex flex-wrap gap-2">
            <ui-badge shape="pill">Default pill</ui-badge>
            <ui-badge variant="success" shape="pill">· Active</ui-badge>
            <ui-badge variant="warning" shape="pill">· Pending</ui-badge>
            <ui-badge variant="destructive" shape="pill">· Error</ui-badge>
            <ui-badge variant="info" shape="pill">· Info</ui-badge>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Blockquote
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Blockquote</h3>
          <p class="mb-3 text-xs" style="color:#888">Styled pull-quote for testimonials, callouts, and editorial emphasis.</p>
          <ui-blockquote>"Precision capping begins with precision data."</ui-blockquote>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Breadcrumb
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Breadcrumb</h3>
          <p class="mb-3 text-xs" style="color:#888">Hierarchical page trail showing the current location in the app.</p>
          <ui-breadcrumb>
            <ui-breadcrumb-list>
              <ui-breadcrumb-item><a uiBreadcrumbLink href="#">Dashboard</a></ui-breadcrumb-item>
              <ui-breadcrumb-separator />
              <ui-breadcrumb-item><a uiBreadcrumbLink href="#">Orders</a></ui-breadcrumb-item>
              <ui-breadcrumb-separator />
              <ui-breadcrumb-item><ui-breadcrumb-page>#4521</ui-breadcrumb-page></ui-breadcrumb-item>
            </ui-breadcrumb-list>
          </ui-breadcrumb>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Button
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Button</h3>
          <p class="mb-3 text-xs" style="color:#888">Versatile action trigger with multiple variants, sizes, and icon support.</p>
          <div class="flex flex-wrap gap-2 mb-2">
            <button ui-button>Default</button>
            <button ui-button variant="secondary">Secondary</button>
            <button ui-button variant="destructive">Destructive</button>
            <button ui-button variant="outline">Outline</button>
            <button ui-button variant="ghost">Ghost</button>
            <button ui-button variant="link">Link</button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button ui-button size="sm">Small</button>
            <button ui-button>Default</button>
            <button ui-button size="lg">Large</button>
            <button ui-button size="icon" variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </button>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Calendar
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Calendar</h3>
          <p class="mb-3 text-xs" style="color:#888">Interactive month view for date browsing and single/range selection.</p>
          <ui-calendar />
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Card
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Card</h3>
          <p class="mb-3 text-xs" style="color:#888">Bordered surface container with header, content, and footer slots. Background variants show all semantic surface tokens.</p>

          <!-- Default card -->
          <ui-card class="mb-4">
            <ui-card-header>
              <ui-card-title>LZR-2000 Status</ui-card-title>
              <ui-card-description>Last updated 2 min ago</ui-card-description>
            </ui-card-header>
            <ui-card-content>
              <p class="text-sm">Running at 290 CPM · 98.4% uptime</p>
            </ui-card-content>
            <ui-card-footer class="justify-end">
              <button ui-button size="sm" variant="outline">View details</button>
            </ui-card-footer>
          </ui-card>

          <!-- Background variants grid -->
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Background Variants</p>
          <div class="grid grid-cols-3 gap-3">
            <ui-card class="bg-background text-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-background</ui-card-title>
                <ui-card-description class="text-[10px]">Page background · --background</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-card text-card-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-card</ui-card-title>
                <ui-card-description class="text-[10px]">Card surface (default) · --card</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-popover text-popover-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-popover</ui-card-title>
                <ui-card-description class="text-[10px]">Popover / dropdown · --popover</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-primary text-primary-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-primary</ui-card-title>
                <ui-card-description class="text-[10px] text-primary-foreground/70">Primary actions · --primary</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-secondary text-secondary-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-secondary</ui-card-title>
                <ui-card-description class="text-[10px]">Secondary surface · --secondary</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-muted text-muted-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-muted</ui-card-title>
                <ui-card-description class="text-[10px]">Muted background · --muted</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-accent text-accent-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-accent</ui-card-title>
                <ui-card-description class="text-[10px]">Hover / accent · --accent</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-destructive text-destructive-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-destructive</ui-card-title>
                <ui-card-description class="text-[10px] text-destructive-foreground/70">Error / danger · --destructive</ui-card-description>
              </ui-card-header>
            </ui-card>
            <ui-card class="bg-sidebar text-sidebar-foreground">
              <ui-card-header class="p-3">
                <ui-card-title class="text-xs">bg-sidebar</ui-card-title>
                <ui-card-description class="text-[10px]">Sidebar surface · --sidebar</ui-card-description>
              </ui-card-header>
            </ui-card>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Carousel (2 columns)
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 grid grid-cols-2 gap-4">

          <!-- LEFT: Counter — dark (default) bottom-right -->
          <div class="rounded-lg border border-border bg-transparent p-4">
            <h3 class="mb-0.5 text-sm font-semibold">Carousel — Counter</h3>
            <p class="mb-3 text-xs" style="color:#888">Counter — dark (default) bottom-right.</p>
            <ui-carousel controls="button" [loop]="true" class="w-full">
              <ui-carousel-content>
                <ui-carousel-item>
                  <div class="flex h-40 items-center justify-center rounded-md bg-primary/10 text-sm font-medium">LZR-2000 Rotary Capper</div>
                </ui-carousel-item>
                <ui-carousel-item>
                  <div class="flex h-40 items-center justify-center rounded-md bg-secondary/20 text-sm font-medium">LZR-1500 Inline Spindle</div>
                </ui-carousel-item>
                <ui-carousel-item>
                  <div class="flex h-40 items-center justify-center rounded-md bg-muted text-sm font-medium">LZR-800 Snap-On System</div>
                </ui-carousel-item>
                <ui-carousel-item>
                  <div class="flex h-40 items-center justify-center rounded-md bg-primary/10 text-sm font-medium">LZR-600 Bench Capper</div>
                </ui-carousel-item>
              </ui-carousel-content>
              <ui-carousel-counter />
            </ui-carousel>
          </div>

          <!-- RIGHT: 3-up (basis-1/3) — slide 1 at a time -->
          <div class="rounded-lg border border-border bg-transparent p-4">
            <h3 class="mb-0.5 text-sm font-semibold">Carousel — 3-up</h3>
            <p class="mb-3 text-xs" style="color:#888">3-up (basis-1/3) — slide 1 at a time.</p>
            <ui-carousel align="start" controls="button" class="w-full">
              <ui-carousel-content>
                <ui-carousel-item class="basis-1/3">
                  <div class="flex h-40 items-center justify-center rounded-md bg-primary/10 text-xs font-medium text-center px-2">LZR-2000</div>
                </ui-carousel-item>
                <ui-carousel-item class="basis-1/3">
                  <div class="flex h-40 items-center justify-center rounded-md bg-secondary/20 text-xs font-medium text-center px-2">LZR-1500</div>
                </ui-carousel-item>
                <ui-carousel-item class="basis-1/3">
                  <div class="flex h-40 items-center justify-center rounded-md bg-muted text-xs font-medium text-center px-2">LZR-800</div>
                </ui-carousel-item>
                <ui-carousel-item class="basis-1/3">
                  <div class="flex h-40 items-center justify-center rounded-md bg-primary/10 text-xs font-medium text-center px-2">LZR-600</div>
                </ui-carousel-item>
                <ui-carousel-item class="basis-1/3">
                  <div class="flex h-40 items-center justify-center rounded-md bg-secondary/20 text-xs font-medium text-center px-2">LZR-400</div>
                </ui-carousel-item>
                <ui-carousel-item class="basis-1/3">
                  <div class="flex h-40 items-center justify-center rounded-md bg-muted text-xs font-medium text-center px-2">LZR-200</div>
                </ui-carousel-item>
              </ui-carousel-content>
            </ui-carousel>
          </div>

        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Chat Bubble
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Chat Bubble</h3>
          <p class="mb-3 text-xs" style="color:#888">Conversation message bubbles for chat interfaces and support widgets.</p>
          <div class="space-y-2">
            <ui-chat-bubble position="left">
              <ui-chat-bubble-avatar><ui-avatar><ui-avatar-fallback>CS</ui-avatar-fallback></ui-avatar></ui-chat-bubble-avatar>
              <ui-chat-bubble-content>Machine LZR-2000 is ready.</ui-chat-bubble-content>
              <ui-chat-bubble-timestamp>09:41</ui-chat-bubble-timestamp>
            </ui-chat-bubble>
            <ui-chat-bubble position="right">
              <ui-chat-bubble-content>Acknowledged, proceeding.</ui-chat-bubble-content>
              <ui-chat-bubble-timestamp>09:42</ui-chat-bubble-timestamp>
            </ui-chat-bubble>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Checkbox
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Checkbox</h3>
          <p class="mb-3 text-xs" style="color:#888">Binary toggle for boolean selections, supports indeterminate state.</p>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm cursor-pointer"><ui-checkbox [checked]="true" /> Accept terms</label>
            <label class="flex items-center gap-2 text-sm cursor-pointer"><ui-checkbox /> Subscribe to updates</label>
            <label class="flex items-center gap-2 text-sm cursor-not-allowed"><ui-checkbox [disabled]="true" /> Disabled option</label>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Collapsible
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Collapsible</h3>
          <p class="mb-3 text-xs" style="color:#888">Single toggle to show or hide an arbitrary content block.</p>
          <ui-collapsible>
            <button ui-button variant="ghost" class="w-full justify-start" uiCollapsibleTrigger>▸ Show advanced options</button>
            <ui-collapsible-content>
              <div class="mt-2 space-y-2 pl-2 text-sm text-muted-foreground">
                <p>Timeout: 30 s</p>
                <p>Retry: 3 attempts</p>
              </div>
            </ui-collapsible-content>
          </ui-collapsible>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Color Picker
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Color Picker</h3>
          <p class="mb-3 text-xs" style="color:#888">Visual hue/saturation/lightness picker with HEX/RGB output.</p>
          <ui-color-picker value="#1a7a4a" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Combobox
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Combobox</h3>
          <p class="mb-3 text-xs" style="color:#888">Searchable dropdown combining an input field with a selection list.</p>
          <ui-combobox [options]="comboboxOptions" placeholder="Search machines…" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Command
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Command</h3>
          <p class="mb-3 text-xs" style="color:#888">Keyboard-driven command palette for fast navigation and search.</p>
          <ui-command>
            <ui-command-input placeholder="Type a command…" />
            <ui-command-list>
              <ui-command-empty>No results.</ui-command-empty>
              <ui-command-group heading="Orders">
                <ui-command-item>New Order <ui-command-shortcut>⌘N</ui-command-shortcut></ui-command-item>
                <ui-command-item>Export CSV <ui-command-shortcut>⌘E</ui-command-shortcut></ui-command-item>
              </ui-command-group>
              <ui-command-group heading="Navigation">
                <ui-command-item>Dashboard</ui-command-item>
                <ui-command-item>Machines</ui-command-item>
              </ui-command-group>
            </ui-command-list>
          </ui-command>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Context Menu
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Context Menu</h3>
          <p class="mb-3 text-xs" style="color:#888">Right-click triggered menu for in-place item actions.</p>
          <ui-context-menu>
            <div uiContextMenuTrigger class="flex h-16 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
              Right-click here
            </div>
            <ui-context-menu-content>
              <ui-context-menu-item>Open</ui-context-menu-item>
              <ui-context-menu-item>Copy link</ui-context-menu-item>
              <ui-context-menu-separator />
              <ui-context-menu-item class="text-destructive">Delete</ui-context-menu-item>
            </ui-context-menu-content>
          </ui-context-menu>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Date Picker
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Date Picker</h3>
          <p class="mb-3 text-xs" style="color:#888">Calendar-based date selector with formatted value display.</p>
          <ui-date-picker />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Dialog (All Sizes + Alert)
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Dialog</h3>
          <p class="mb-3 text-xs" style="color:#888">Accessible modal overlay with size variants: xxs, xs, sm, md, default, lg, xl, xxl, full, and alert mode.</p>
          <div class="flex flex-wrap gap-2">

            <!-- XXS -->
            <ui-dialog size="xxs">
              <button ui-button variant="outline" size="sm" uiDialogTrigger>XXS</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>XXS Dialog</ui-dialog-title>
                  <ui-dialog-description>Tiny confirmation prompt.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <p class="text-sm text-muted-foreground">Minimal content area.</p>
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" size="sm" uiDialogClose>Cancel</button>
                  <button ui-button size="sm" uiDialogClose>OK</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- XS -->
            <ui-dialog size="xs">
              <button ui-button variant="outline" size="sm" uiDialogTrigger>XS</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>XS Dialog</ui-dialog-title>
                  <ui-dialog-description>Compact prompt for quick actions.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <p class="text-sm text-muted-foreground">Extra-small dialog content.</p>
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" size="sm" uiDialogClose>Cancel</button>
                  <button ui-button size="sm" uiDialogClose>Confirm</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- SM -->
            <ui-dialog size="sm">
              <button ui-button variant="outline" size="sm" uiDialogTrigger>SM</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>Small Dialog</ui-dialog-title>
                  <ui-dialog-description>Compact dialog for quick confirmations.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <p class="text-sm text-muted-foreground">A brief prompt that doesn't need much space.</p>
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" size="sm" uiDialogClose>Cancel</button>
                  <button ui-button size="sm">OK</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- MD -->
            <ui-dialog size="md">
              <button ui-button variant="outline" size="sm" uiDialogTrigger>MD</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>Medium Dialog</ui-dialog-title>
                  <ui-dialog-description>Standard forms and detail views.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <input uiInput placeholder="Enter value…" />
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" uiDialogClose>Cancel</button>
                  <button ui-button uiDialogClose>Save</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- DEFAULT -->
            <ui-dialog>
              <button ui-button variant="outline" size="sm" uiDialogTrigger>Default</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>Default Dialog</ui-dialog-title>
                  <ui-dialog-description>Standard dialog for forms and confirmations.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <input uiInput placeholder="Reason for change…" />
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" uiDialogClose>Cancel</button>
                  <button ui-button>Confirm</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- LG -->
            <ui-dialog size="lg">
              <button ui-button variant="outline" size="sm" uiDialogTrigger>LG</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>Large Dialog</ui-dialog-title>
                  <ui-dialog-description>More room for detailed forms or content review.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <div class="space-y-3">
                    <input uiInput placeholder="Machine name" />
                    <input uiInput placeholder="Serial number" />
                    <textarea uiTextarea placeholder="Notes…"></textarea>
                  </div>
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" uiDialogClose>Cancel</button>
                  <button ui-button>Save</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- XL -->
            <ui-dialog size="xl">
              <button ui-button variant="outline" size="sm" uiDialogTrigger>XL</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>Extra Large Dialog</ui-dialog-title>
                  <ui-dialog-description>Spacious layout for data-heavy views and multi-column forms.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <div class="grid grid-cols-2 gap-4">
                    <input uiInput placeholder="First name" />
                    <input uiInput placeholder="Last name" />
                    <input uiInput placeholder="Email" />
                    <input uiInput placeholder="Phone" />
                    <textarea uiTextarea placeholder="Address…" class="col-span-2"></textarea>
                  </div>
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" uiDialogClose>Cancel</button>
                  <button ui-button>Submit</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- XXL -->
            <ui-dialog size="xxl">
              <button ui-button variant="outline" size="sm" uiDialogTrigger>XXL</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>XXL Dialog</ui-dialog-title>
                  <ui-dialog-description>Dashboards and wide content layouts.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <div class="grid grid-cols-3 gap-4">
                    <input uiInput placeholder="Company" />
                    <input uiInput placeholder="Contact" />
                    <input uiInput placeholder="Phone" />
                    <input uiInput placeholder="Email" />
                    <input uiInput placeholder="Website" />
                    <input uiInput placeholder="Industry" />
                  </div>
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" uiDialogClose>Cancel</button>
                  <button ui-button>Update</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- FULL -->
            <ui-dialog size="full">
              <button ui-button variant="outline" size="sm" uiDialogTrigger>Full</button>
              <ui-dialog-content>
                <ui-dialog-header>
                  <ui-dialog-title>Fullscreen Dialog</ui-dialog-title>
                  <ui-dialog-description>Takes up the entire viewport for immersive workflows.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-body>
                  <p class="text-sm text-muted-foreground">This could contain a complex editor, data table, or multi-step form.</p>
                </ui-dialog-body>
                <ui-dialog-footer>
                  <button ui-button variant="outline" uiDialogClose>Close</button>
                  <button ui-button>Done</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

            <!-- ALERT -->
            <ui-dialog>
              <button ui-button variant="destructive" size="sm" uiDialogTrigger>Alert</button>
              <ui-dialog-content mode="alert">
                <ui-dialog-header>
                  <ui-dialog-title>Are you absolutely sure?</ui-dialog-title>
                  <ui-dialog-description>This action cannot be undone.</ui-dialog-description>
                </ui-dialog-header>
                <ui-dialog-footer>
                  <button ui-button variant="outline" uiDialogCancel>Cancel</button>
                  <button ui-button variant="destructive" uiDialogAction>Delete</button>
                </ui-dialog-footer>
              </ui-dialog-content>
            </ui-dialog>

          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Drawer
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Drawer</h3>
          <p class="mb-3 text-xs" style="color:#888">Side-sliding panel for forms, filters, and supplementary content.</p>
          <ui-drawer>
            <button ui-button variant="outline" uiDrawerTrigger>Open Drawer</button>
            <ui-drawer-content>
              <ui-drawer-header>
                <ui-drawer-title>Edit Order</ui-drawer-title>
                <ui-drawer-description>Update the order details below.</ui-drawer-description>
              </ui-drawer-header>
              <div class="p-4 space-y-3">
                <input uiInput placeholder="Customer name…" />
                <textarea uiTextarea placeholder="Notes…" rows="3"></textarea>
              </div>
              <ui-drawer-footer>
                <button ui-button>Save</button>
                <button ui-button variant="outline" uiDrawerClose>Close</button>
              </ui-drawer-footer>
            </ui-drawer-content>
          </ui-drawer>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Dropdown Menu
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Dropdown Menu</h3>
          <p class="mb-3 text-xs" style="color:#888">Button-triggered contextual menu with grouped items and shortcuts.</p>
          <ui-dropdown>
            <button ui-button variant="outline" uiDropdownTrigger>Actions ▾</button>
            <div uiDropdownContent class="min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
              <ui-dropdown-label>Order #4521</ui-dropdown-label>
              <ui-dropdown-separator />
              <ui-dropdown-item>Edit <ui-dropdown-shortcut>⌘E</ui-dropdown-shortcut></ui-dropdown-item>
              <ui-dropdown-item>Duplicate</ui-dropdown-item>
              <ui-dropdown-separator />
              <ui-dropdown-item class="text-destructive">Delete</ui-dropdown-item>
            </div>
          </ui-dropdown>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — State
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">State</h3>
          <p class="mb-3 text-xs" style="color:#888">Zero-data placeholder with icon, message, and optional CTA.</p>
          <div class="grid grid-cols-2 gap-4">
            <ui-state state="empty" title="No orders found" description="Try adjusting your filters." class="py-4" />
            <ui-state state="error" title="Failed to load" description="Something went wrong." class="py-4" />
            <ui-state state="warning" title="Unsaved changes" description="You have pending changes." class="py-4" />
            <ui-state state="success" title="Order submitted" description="Your order was placed." class="py-4" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — File Input
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">File Input</h3>
          <p class="mb-3 text-xs" style="color:#888">Native file picker input styled to match the design system.</p>
          <ui-file-input accept=".pdf,.docx" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — File Upload
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">File Upload</h3>
          <p class="mb-3 text-xs" style="color:#888">Drag-and-drop zone with progress tracking and file list display.</p>
          <ui-file-upload accept=".pdf,.xlsx" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Form Field
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Form Field</h3>
          <p class="mb-3 text-xs" style="color:#888">Label + control + validation message wrapper for reactive forms.</p>
          <div class="flex flex-col gap-4">
            <ui-form-field>
              <label uiLabel [required]="true">Serial Number</label>
              <ui-form-control>
                <input uiInput placeholder="LZR-XXXX-YYYY" />
              </ui-form-control>
              <ui-form-message>Enter the machine's serial number.</ui-form-message>
            </ui-form-field>
            <ui-form-field>
              <label uiLabel>Operator Email</label>
              <ui-form-control>
                <input uiInput status="error" value="not-valid" />
              </ui-form-control>
              <ui-form-message type="error">Please enter a valid email.</ui-form-message>
            </ui-form-field>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Hover Card
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Hover Card</h3>
          <p class="mb-3 text-xs" style="color:#888">Preview card that appears on hover with rich contextual information.</p>
          <ui-hover-card>
            <a class="text-sm underline text-primary cursor-pointer" uiHoverCardTrigger>@acme-corp</a>
            <ui-hover-card-content>
              <div class="flex gap-3">
                <ui-avatar><ui-avatar-fallback>AC</ui-avatar-fallback></ui-avatar>
                <div>
                  <p class="text-sm font-medium">Acme Corp</p>
                  <p class="text-xs text-muted-foreground">50 orders · Since 2022</p>
                </div>
              </div>
            </ui-hover-card-content>
          </ui-hover-card>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Input
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Input</h3>
          <p class="mb-3 text-xs" style="color:#888">Standard text input with size variants and disabled state.</p>
          <div class="space-y-2">
            <input uiInput placeholder="Default input" />
            <input uiInput placeholder="Small" size="sm" />
            <input uiInput placeholder="Disabled" disabled />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Input Group
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Input Group</h3>
          <p class="mb-3 text-xs" style="color:#888">Input with prefix/suffix addons for icons, labels, or action buttons.</p>
          <ui-input-group>
            <ui-input-addon>https://</ui-input-addon>
            <input uiInput placeholder="domain.com" />
          </ui-input-group>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Input Number
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Input Number</h3>
          <p class="mb-3 text-xs" style="color:#888">Numeric input with built-in stepper arrows and min/max constraints.</p>
          <ui-input-number [value]="1" [min]="0" [max]="99" placeholder="Qty" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Kbd
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Kbd</h3>
          <p class="mb-3 text-xs" style="color:#888">Keyboard key representation for shortcut documentation and hints.</p>
          <div class="flex flex-wrap items-center gap-2 text-sm">
            <span>Save</span>
            <ui-kbd>⌘</ui-kbd><ui-kbd>S</ui-kbd>
            <span class="ml-2">Search</span>
            <ui-kbd>⌘</ui-kbd><ui-kbd>K</ui-kbd>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Legend Indicator
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Legend Indicator</h3>
          <p class="mb-3 text-xs" style="color:#888">Colored dot + label pairs for chart legends and status keys.</p>
          <div class="space-y-1.5">
            <ui-legend-indicator color="green" label="Online" />
            <ui-legend-indicator color="orange" label="Maintenance" />
            <ui-legend-indicator color="red" label="Offline" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — List Group
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">List Group</h3>
          <p class="mb-3 text-xs" style="color:#888">Bordered list of items with optional icons, badges, and actions.</p>
          <ui-list-group>
            <ui-list-group-item>Dashboard</ui-list-group-item>
            <ui-list-group-item [active]="true">Orders</ui-list-group-item>
            <ui-list-group-item>Machines</ui-list-group-item>
            <ui-list-group-item [disabled]="true">Reports</ui-list-group-item>
          </ui-list-group>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Loader & Spinner
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Loader &amp; Spinner</h3>
          <p class="mb-3 text-xs" style="color:#888">Animated indicators for async operations and indeterminate loading.</p>
          <div class="flex items-center gap-6">
            <ui-spinner size="sm" />
            <ui-spinner />
            <ui-spinner size="lg" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — MegaMenu
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Mega Menu</h3>
          <p class="mb-3 text-xs" style="color:#888">Wide multi-section flyout navigation for content-rich site structures.</p>
          <ui-mega-menu>
            <ui-mega-menu-item>
              <button uiMegaMenuTrigger>Products</button>
              <ui-mega-menu-content>
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title>Rotary</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#">LZR-2000</a>
                  <a uiMegaMenuLink href="#">LZR-1500</a>
                </ui-mega-menu-section>
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title>Inline</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#">LZR-800</a>
                  <a uiMegaMenuLink href="#">LZR-500</a>
                </ui-mega-menu-section>
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title>Custom</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#">Request Quote</a>
                </ui-mega-menu-section>
              </ui-mega-menu-content>
            </ui-mega-menu-item>
            <ui-mega-menu-item>
              <button uiMegaMenuTrigger>Solutions</button>
              <ui-mega-menu-content>
                <ui-mega-menu-section>
                  <ui-mega-menu-section-title>Industries</ui-mega-menu-section-title>
                  <a uiMegaMenuLink href="#">Beverage</a>
                  <a uiMegaMenuLink href="#">Pharmaceutical</a>
                  <a uiMegaMenuLink href="#">Cosmetics</a>
                </ui-mega-menu-section>
              </ui-mega-menu-content>
            </ui-mega-menu-item>
          </ui-mega-menu>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Menubar
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Menubar</h3>
          <p class="mb-3 text-xs" style="color:#888">Desktop-style horizontal application menu bar with nested items.</p>
          <ui-menubar>
            <ui-menubar-menu>
              <ui-menubar-trigger>File</ui-menubar-trigger>
              <ui-menubar-content>
                <ui-menubar-item>New Order <ui-menubar-shortcut>⌘N</ui-menubar-shortcut></ui-menubar-item>
                <ui-menubar-item>Open</ui-menubar-item>
                <ui-menubar-separator />
                <ui-menubar-item>Export PDF</ui-menubar-item>
              </ui-menubar-content>
            </ui-menubar-menu>
            <ui-menubar-menu>
              <ui-menubar-trigger>Edit</ui-menubar-trigger>
              <ui-menubar-content>
                <ui-menubar-item>Undo <ui-menubar-shortcut>⌘Z</ui-menubar-shortcut></ui-menubar-item>
                <ui-menubar-item>Redo</ui-menubar-item>
              </ui-menubar-content>
            </ui-menubar-menu>
            <ui-menubar-menu>
              <ui-menubar-trigger>View</ui-menubar-trigger>
              <ui-menubar-content>
                <ui-menubar-label>Layout</ui-menubar-label>
                <ui-menubar-item>Table View</ui-menubar-item>
                <ui-menubar-item>Card View</ui-menubar-item>
              </ui-menubar-content>
            </ui-menubar-menu>
          </ui-menubar>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Navbar
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Navbar</h3>
          <p class="mb-3 text-xs" style="color:#888">Top navigation bar with brand, links, search, and action slots.</p>
          <ui-navbar>
            <ui-navbar-brand>Lazar</ui-navbar-brand>
            <ui-navbar-nav>
              <a uiNavbarItem>Dashboard</a>
              <a uiNavbarItem>Orders</a>
              <a uiNavbarItem>Machines</a>
            </ui-navbar-nav>
            <ui-navbar-actions>
              <button ui-button size="sm" variant="outline">Login</button>
            </ui-navbar-actions>
          </ui-navbar>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Navigation Menu
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Navigation Menu</h3>
          <p class="mb-3 text-xs" style="color:#888">Accessible top-nav with hover-triggered multi-column dropdown panels.</p>
          <ui-nav-menu>
            <ui-nav-menu-list>
              <ui-nav-menu-item>
                <ui-nav-menu-trigger>Products</ui-nav-menu-trigger>
                <ui-nav-menu-content>
                  <div class="grid grid-cols-2 gap-2 w-96">
                    <a uiNavMenuLink href="#">Rotary Cappers</a>
                    <a uiNavMenuLink href="#">Inline Spindle</a>
                    <a uiNavMenuLink href="#">Snap-On Systems</a>
                    <a uiNavMenuLink href="#">Custom Solutions</a>
                  </div>
                </ui-nav-menu-content>
              </ui-nav-menu-item>
              <ui-nav-menu-item>
                <ui-nav-menu-trigger>Support</ui-nav-menu-trigger>
                <ui-nav-menu-content>
                  <div class="w-64">
                    <a uiNavMenuLink href="#">Documentation</a>
                    <a uiNavMenuLink href="#">Contact Us</a>
                  </div>
                </ui-nav-menu-content>
              </ui-nav-menu-item>
            </ui-nav-menu-list>
          </ui-nav-menu>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Pagination
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Pagination</h3>
          <p class="mb-3 text-xs" style="color:#888">Page navigation controls with auto-generated page numbers, ellipsis, and minimal variant.</p>
          <div class="space-y-3">
            <p class="text-xs text-muted-foreground">Default — auto-generated (page 5 of 20)</p>
            <ui-pagination [total]="200" [pageSize]="10" [pageIndex]="5" variant="default" />
            <p class="text-xs text-muted-foreground">Minimal — Prev / Next only</p>
            <ui-pagination [total]="200" [pageSize]="10" [pageIndex]="5" variant="minimal" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Pin Input
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Pin Input</h3>
          <p class="mb-3 text-xs" style="color:#888">Auto-advancing digit boxes for OTP and verification codes.</p>
          <ui-input-pin [length]="6" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Placeholder Image
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Placeholder Image</h3>
          <p class="mb-3 text-xs" style="color:#888"><code>placeholderImage()</code> utility — defaults 300x300, supports ratios 1:1, 4:3, 16:9, 3:2.</p>
          <div class="flex flex-wrap items-end gap-2">
            <img [src]="placeholderSquare" alt="1:1" class="rounded-md border border-border" />
            <img [src]="placeholderStandard" alt="4:3" class="rounded-md border border-border" />
            <img [src]="placeholderPhoto" alt="3:2" class="rounded-md border border-border" />
            <img [src]="placeholderWide" alt="16:9" class="rounded-md border border-border" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Popover
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Popover</h3>
          <p class="mb-3 text-xs" style="color:#888">Click-triggered floating panel for inline forms and additional options.</p>
          <ui-popover>
            <button ui-button variant="outline" uiPopoverTrigger>Open Popover</button>
            <ui-popover-content>
              <p class="text-sm font-medium mb-1">Filter by status</p>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><ui-checkbox />Active</label>
              <label class="flex items-center gap-2 text-sm mt-1 cursor-pointer"><ui-checkbox />Maintenance</label>
            </ui-popover-content>
          </ui-popover>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Progress
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Progress</h3>
          <p class="mb-3 text-xs" style="color:#888">Linear bar showing completion percentage of a task or upload.</p>
          <div class="space-y-3">
            <ui-progress [value]="65" />
            <ui-progress [value]="30" variant="secondary" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Prose
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Prose</h3>
          <p class="mb-3 text-xs" style="color:#888">Typography wrapper that applies readable styles to raw HTML content.</p>
          <ui-prose>
            <h4>Installation Guide</h4>
            <p>Mount the LZR-2000 on a flat surface. Connect power supply and run the calibration wizard.</p>
            <ul><li>Torque: 15 Nm</li><li>Speed: 300 CPM</li></ul>
          </ui-prose>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Radio Group
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Radio Group</h3>
          <p class="mb-3 text-xs" style="color:#888">Mutually exclusive options where only one value can be selected.</p>
          <ui-radio-group value="standard">
            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-2 text-sm cursor-pointer"><ui-radio-group-item value="standard" />Standard</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><ui-radio-group-item value="express" />Express</label>
              <label class="flex items-center gap-2 text-sm cursor-pointer"><ui-radio-group-item value="priority" />Priority</label>
            </div>
          </ui-radio-group>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Ratings
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Ratings</h3>
          <p class="mb-3 text-xs" style="color:#888">Star-based rating display and input for user feedback or scoring.</p>
          <div class="space-y-2">
            <ui-ratings [value]="4" />
            <ui-ratings [value]="3.5" [readonly]="false" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Resizable
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Resizable</h3>
          <p class="mb-3 text-xs" style="color:#888">Drag-to-resize panel splitter for side-by-side adjustable layouts.</p>
          <ui-resizable class="h-48 rounded-md border border-border">
            <ui-resizable-panel [size]="35">
              <div class="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">Left Panel</div>
            </ui-resizable-panel>
            <ui-resizable-handle />
            <ui-resizable-panel>
              <div class="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">Right Panel</div>
            </ui-resizable-panel>
          </ui-resizable>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Scroll Area
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Scroll Area</h3>
          <p class="mb-3 text-xs" style="color:#888">Custom-styled scrollable container with a thin overlay scrollbar.</p>
          <ui-scroll-area class="h-36 rounded-md border border-border p-2">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <p class="py-1.5 text-sm border-b border-border last:border-0">Order #{{ 4500 + i }}</p>
            }
          </ui-scroll-area>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Searchbox
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Searchbox</h3>
          <p class="mb-3 text-xs" style="color:#888">Autocomplete search input with async-ready result rendering.</p>
          <ui-searchbox placeholder="Search orders…" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Segmented
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Segmented</h3>
          <p class="mb-3 text-xs" style="color:#888">Pill-style tab switcher for toggling between a small set of views.</p>
          <ui-segmented [options]="segmentedOptions" value="week" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Select
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Select</h3>
          <p class="mb-3 text-xs" style="color:#888">Dropdown picker for choosing one item from a predefined list.</p>
          <ui-select>
            <ui-select-trigger><ui-select-value placeholder="Select machine…" /></ui-select-trigger>
            <ui-select-content>
              <ui-select-group>
                <ui-select-label>Rotary</ui-select-label>
                <ui-select-item value="lzr2000">LZR-2000</ui-select-item>
                <ui-select-item value="lzr1500">LZR-1500</ui-select-item>
              </ui-select-group>
              <ui-select-separator />
              <ui-select-group>
                <ui-select-label>Inline</ui-select-label>
                <ui-select-item value="lzr800">LZR-800</ui-select-item>
              </ui-select-group>
            </ui-select-content>
          </ui-select>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Select (Options Array / Searchable)
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Select (Options Array)</h3>
          <p class="mb-3 text-xs" style="color:#888">Simplified API using options array with built-in search.</p>
          <div class="space-y-3">
            <ui-select [options]="selectOptions" placeholder="Select machine…" />
            <ui-select [options]="selectOptions" [searchable]="true" placeholder="Search machines…" />
            <ui-select [options]="selectOptions" [multiple]="true" [searchable]="true" [maxLabelCount]="2" placeholder="Multi-select…" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Separator & Divider
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Separator &amp; Divider</h3>
          <p class="mb-3 text-xs" style="color:#888">Horizontal or vertical rule for visually separating content regions.</p>
          <div class="space-y-3">
            <p class="text-xs">Above the line</p>
            <ui-separator />
            <p class="text-xs">Below the line</p>
            <ui-divider label="OR" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Skeleton
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Skeleton</h3>
          <p class="mb-3 text-xs" style="color:#888">Animated placeholder that mimics content shape during loading.</p>
          <div class="space-y-2">
            <ui-skeleton class="h-4 w-3/4" />
            <ui-skeleton class="h-4 w-full" />
            <ui-skeleton class="h-4 w-1/2" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Slider
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Slider</h3>
          <p class="mb-3 text-xs" style="color:#888">Draggable range control for selecting numeric values within a range.</p>
          <ui-slider [value]="60" [min]="0" [max]="100" class="my-4" />
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Stepper
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Stepper</h3>
          <p class="mb-3 text-xs" style="color:#888">Multi-step progress indicator for wizards and sequential workflows.</p>
          <ui-stepper [steps]="stepperSteps" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Strong Password
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Strong Password</h3>
          <p class="mb-3 text-xs" style="color:#888">Password input with live strength meter and rule checklist.</p>
          <ui-strong-password placeholder="Create password…" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Styled Icon
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Icon Styled</h3>
          <p class="mb-3 text-xs" style="color:#888">Icon wrapped in a colored, rounded background for visual hierarchy.</p>
          <div class="flex gap-3">
            <ui-icon-styled icon="settings" variant="primary" />
            <ui-icon-styled icon="chart" variant="success" />
            <ui-icon-styled icon="alert" variant="warning" />
            <ui-icon-styled icon="close" variant="destructive" />
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Switch
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Switch</h3>
          <p class="mb-3 text-xs" style="color:#888">Sliding toggle for on/off binary settings like notifications.</p>
          <div class="space-y-2">
            <label class="flex items-center justify-between text-sm">Email alerts <ui-switch [checked]="true" /></label>
            <label class="flex items-center justify-between text-sm">SMS alerts <ui-switch /></label>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Tabs
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Tabs</h3>
          <p class="mb-3 text-xs" style="color:#888">Segmented panel switcher with multiple style variants.</p>
          <div class="flex flex-col gap-6">
            <div>
              <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Default</p>
              <ui-tabs value="overview">
                <ui-tabs-list>
                  <ui-tabs-trigger value="overview">Overview</ui-tabs-trigger>
                  <ui-tabs-trigger value="orders">Orders</ui-tabs-trigger>
                  <ui-tabs-trigger value="machines">Machines</ui-tabs-trigger>
                  <ui-tabs-trigger value="reports">Reports</ui-tabs-trigger>
                </ui-tabs-list>
              </ui-tabs>
            </div>
            <div>
              <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Underline</p>
              <ui-tabs value="orders" variant="underline">
                <ui-tabs-list>
                  <ui-tabs-trigger value="overview">Overview</ui-tabs-trigger>
                  <ui-tabs-trigger value="orders">Orders</ui-tabs-trigger>
                  <ui-tabs-trigger value="machines">Machines</ui-tabs-trigger>
                  <ui-tabs-trigger value="reports">Reports</ui-tabs-trigger>
                </ui-tabs-list>
              </ui-tabs>
            </div>
            <div>
              <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Pills</p>
              <ui-tabs value="machines" variant="pills">
                <ui-tabs-list>
                  <ui-tabs-trigger value="overview">Overview</ui-tabs-trigger>
                  <ui-tabs-trigger value="orders">Orders</ui-tabs-trigger>
                  <ui-tabs-trigger value="machines">Machines</ui-tabs-trigger>
                  <ui-tabs-trigger value="reports">Reports</ui-tabs-trigger>
                </ui-tabs-list>
              </ui-tabs>
            </div>
            <div>
              <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Card</p>
              <ui-tabs value="reports" variant="card">
                <ui-tabs-list>
                  <ui-tabs-trigger value="overview">Overview</ui-tabs-trigger>
                  <ui-tabs-trigger value="orders">Orders</ui-tabs-trigger>
                  <ui-tabs-trigger value="machines">Machines</ui-tabs-trigger>
                  <ui-tabs-trigger value="reports">Reports</ui-tabs-trigger>
                </ui-tabs-list>
              </ui-tabs>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Table (Primitive)
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Table — Primitive Mode</h3>
          <p class="mb-3 text-xs" style="color:#888">Composable table built from sub-components: header, body, row, cell, footer.</p>
          <ui-table>
            <ui-table-caption>Recent Orders — Q1 2026</ui-table-caption>
            <ui-table-header>
              <ui-table-row>
                <ui-table-head>Order #</ui-table-head>
                <ui-table-head>Customer</ui-table-head>
                <ui-table-head>Status</ui-table-head>
                <ui-table-head class="text-right">Amount</ui-table-head>
              </ui-table-row>
            </ui-table-header>
            <ui-table-body>
              <ui-table-row>
                <ui-table-cell class="font-medium">ORD-4521</ui-table-cell>
                <ui-table-cell>Acme Corp</ui-table-cell>
                <ui-table-cell><span class="text-green-600">Shipped</span></ui-table-cell>
                <ui-table-cell class="text-right">$12,400</ui-table-cell>
              </ui-table-row>
              <ui-table-row>
                <ui-table-cell class="font-medium">ORD-4520</ui-table-cell>
                <ui-table-cell>BevCo Industries</ui-table-cell>
                <ui-table-cell><span class="text-yellow-600">Processing</span></ui-table-cell>
                <ui-table-cell class="text-right">$8,200</ui-table-cell>
              </ui-table-row>
              <ui-table-row>
                <ui-table-cell class="font-medium">ORD-4519</ui-table-cell>
                <ui-table-cell>PharmaLine Ltd</ui-table-cell>
                <ui-table-cell><span class="text-blue-600">Delivered</span></ui-table-cell>
                <ui-table-cell class="text-right">$31,750</ui-table-cell>
              </ui-table-row>
            </ui-table-body>
            <ui-table-footer>
              <ui-table-row>
                <ui-table-cell colspan="3" class="font-medium">3 orders</ui-table-cell>
                <ui-table-cell class="text-right font-bold">$52,350</ui-table-cell>
              </ui-table-row>
            </ui-table-footer>
          </ui-table>
        </div>

        <!-- ══════════════════════════════════════════════════
             FULL WIDTH — Table (Data-Driven)
             ══════════════════════════════════════════════════ -->
        <div class="col-span-3 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Table — Data-Driven Mode</h3>
          <p class="mb-3 text-xs" style="color:#888">Auto-generated table from a data array and column config, with sort, filter, and pagination.</p>
          <ui-table
            [data]="tableData"
            [columns]="tableColumns"
            rowId="id"
            [filterable]="true"
            [paginated]="true"
            [pageSize]="3"
          />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Textarea
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Textarea</h3>
          <p class="mb-3 text-xs" style="color:#888">Multi-line text input for longer form content like descriptions.</p>
          <textarea uiTextarea placeholder="Enter notes…" rows="3"></textarea>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Theme Selector
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Theme Selector</h3>
          <p class="mb-3 text-xs" style="color:#888">Panel for selecting color presets, accent colors, and font themes.</p>
          <ui-theme-selector />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Theme Toggle
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Theme Toggle</h3>
          <p class="mb-3 text-xs" style="color:#888">Single-click button to switch between light and dark color schemes.</p>
          <ui-theme-toggle />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Time Picker
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Time Picker</h3>
          <p class="mb-3 text-xs" style="color:#888">Scrollable hour/minute/period selector for time-of-day input.</p>
          <ui-time-picker value="09:30" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Timeline
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Timeline</h3>
          <p class="mb-3 text-xs" style="color:#888">Vertically ordered event history with icons, labels, and timestamps.</p>
          <ui-timeline>
            <ui-timeline-item>
              <ui-timeline-icon>✓</ui-timeline-icon>
              <ui-timeline-content>
                <p class="text-sm font-medium">Order Placed</p>
                <p class="text-xs text-muted-foreground">Jan 10, 09:00</p>
              </ui-timeline-content>
            </ui-timeline-item>
            <ui-timeline-item>
              <ui-timeline-icon>⚙</ui-timeline-icon>
              <ui-timeline-content>
                <p class="text-sm font-medium">In Production</p>
                <p class="text-xs text-muted-foreground">Jan 12, 14:30</p>
              </ui-timeline-content>
            </ui-timeline-item>
            <ui-timeline-item>
              <ui-timeline-icon>◎</ui-timeline-icon>
              <ui-timeline-content>
                <p class="text-sm font-medium">Quality Check</p>
                <p class="text-xs text-muted-foreground">Scheduled</p>
              </ui-timeline-content>
            </ui-timeline-item>
          </ui-timeline>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Toast
             ══════════════════════════════════════════════════ -->
        <div class="col-span-2 rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Toast</h3>
          <p class="mb-3 text-xs" style="color:#888">Non-blocking notification with rich colors, GSAP animations, and multiple variants. Newest at bottom.</p>

          <div class="space-y-3">
            <!-- Types (rich colors) -->
            <div>
              <p class="mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Types (Rich Colors)</p>
              <div class="flex flex-wrap gap-2">
                <button ui-button variant="outline" size="sm" (click)="toastFn()">Default</button>
                <button ui-button variant="outline" size="sm" (click)="toastSuccess()">Success</button>
                <button ui-button variant="destructive" size="sm" (click)="toastError()">Error</button>
                <button ui-button variant="outline" size="sm" (click)="toastWarning()">Warning</button>
                <button ui-button variant="outline" size="sm" (click)="toastInfo()">Info</button>
                <button ui-button variant="outline" size="sm" (click)="toastLoading()">Loading</button>
              </div>
            </div>

            <!-- Variants & Features -->
            <div>
              <p class="mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Variants & Features</p>
              <div class="flex flex-wrap gap-2">
                <button ui-button variant="destructive" size="sm" (click)="toastDestructive()">Destructive</button>
                <button ui-button variant="outline" size="sm" (click)="toastAction()">With Action</button>
                <button ui-button variant="outline" size="sm" (click)="toastClose()">With Close</button>
                <button ui-button variant="secondary" size="sm" (click)="toastPlain()">Plain (no color)</button>
              </div>
            </div>

            <!-- Rapid fire -->
            <div>
              <p class="mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">Stack Animation</p>
              <div class="flex flex-wrap gap-2">
                <button ui-button variant="outline" size="sm" (click)="toastAll()">Fire All Types</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Toggle
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Toggle</h3>
          <p class="mb-3 text-xs" style="color:#888">Single pressable button that switches between active and inactive states.</p>
          <div class="flex gap-2">
            <ui-toggle>Bold</ui-toggle>
            <ui-toggle [pressed]="true">Italic</ui-toggle>
            <ui-toggle variant="outline">Underline</ui-toggle>
          </div>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Toggle Count
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Toggle Count</h3>
          <p class="mb-3 text-xs" style="color:#888">Increment/decrement counter with configurable min, max, and step.</p>
          <ui-toggle-count [value]="3" [min]="0" [max]="10" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Toggle Group
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Toggle Group</h3>
          <p class="mb-3 text-xs" style="color:#888">Group of mutually exclusive or multi-selectable toggle buttons.</p>
          <ui-toggle-group value="left">
            <ui-toggle-group-item value="left">Left</ui-toggle-group-item>
            <ui-toggle-group-item value="center">Center</ui-toggle-group-item>
            <ui-toggle-group-item value="right">Right</ui-toggle-group-item>
          </ui-toggle-group>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Toggle Password
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Toggle Password</h3>
          <p class="mb-3 text-xs" style="color:#888">Password input with a show/hide visibility toggle button.</p>
          <ui-toggle-password placeholder="Enter password…" />
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Tooltip
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Tooltip</h3>
          <p class="mb-3 text-xs" style="color:#888">Floating label that appears on hover to provide contextual hints.</p>
          <ui-tooltip>
            <button ui-button variant="outline" uiTooltipTrigger>Hover me</button>
            <ui-tooltip-content>Machine serial: LZR-2000-A4</ui-tooltip-content>
          </ui-tooltip>
        </div>

        <!-- ══════════════════════════════════════════════════
             3-COL — Tree
             ══════════════════════════════════════════════════ -->
        <div class="rounded-lg border border-border bg-transparent p-4">
          <h3 class="mb-0.5 text-sm font-semibold">Tree</h3>
          <p class="mb-3 text-xs" style="color:#888">Hierarchical collapsible node view for nested data structures.</p>
          <ui-tree [nodes]="treeNodes" />
        </div>

      </div>
    `,
  }),
};
