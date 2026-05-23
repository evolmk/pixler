import {
  type LucideIconData,
  Activity,
  AlarmClock,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  BarChart3,
  Battery,
  Beaker,
  Bell,
  BellOff,
  Ban,
  Bolt,
  Book,
  BookOpen,
  Bookmark,
  Box,
  Boxes,
  Calculator,
  Calendar,
  Camera,
  ChartLine,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleAlert,
  CircleArrowDown,
  CircleArrowLeft,
  CircleArrowRight,
  CircleArrowUp,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleHelp,
  CirclePlay,
  CircleX,
  Clipboard,
  ClipboardList,
  Clock,
  Cloud,
  CloudOff,
  Compass,
  Copy,
  CreditCard,
  Cpu,
  Database,
  DollarSign,
  Download,
  Drill,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileText,
  Files,
  Filter,
  Flag,
  Flame,
  FlaskConical,
  Folder,
  FolderOpen,
  Gauge,
  Gem,
  GlassWater,
  Globe,
  Grid3x3,
  Grip,
  GripVertical,
  Hammer,
  HardDrive,
  HardHat,
  Heart,
  Hexagon,
  Home,
  Hourglass,
  Image,
  Images,
  Info,
  KeyRound,
  LayoutGrid,
  LayoutList,
  Lightbulb,
  Link,
  List,
  ListChecks,
  Loader,
  Lock,
  Magnet,
  Mail,
  Map,
  MapPin,
  Maximize,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  MicOff,
  Minimize,
  Minus,
  Monitor,
  MoveHorizontal,
  MoveVertical,
  Navigation,
  OctagonAlert,
  Package,
  PackageOpen,
  Paperclip,
  Pause,
  Pencil,
  Phone,
  PieChart,
  Pin,
  Pipette,
  Play,
  Plus,
  Power,
  Printer,
  Ratio,
  RefreshCw,
  RotateCw,
  Ruler,
  Save,
  Scale,
  Scissors,
  Search,
  Send,
  Server,
  Settings,
  Settings2,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Siren,
  SkipBack,
  SkipForward,
  Smartphone,
  Smile,
  Square,
  SquareCheck,
  Star,
  StopCircle,
  Tag,
  Tags,
  Target,
  Terminal,
  Thermometer,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Trash2,
  TrendingDown,
  TrendingUp,
  Triangle,
  TriangleAlert,
  Trophy,
  Truck,
  Upload,
  User,
  UserCheck,
  Users,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  Wrench,
  X,
  XCircle,
  Zap,
} from 'lucide-angular';

/** Curated icon entry — what appears in the picker grid. */
export interface IconCatalogEntry {
  /** Canonical kebab-case slug stored in the DB. */
  slug: string;
  /** Display label for the picker. */
  label: string;
  /** Lucide component rendered at the preview/picker. */
  icon: LucideIconData;
  /** Grouping label used to organize the picker grid. */
  group: string;
}

/**
 * Curated Lucide icons available for manual icons. Authors pick from these in the
 * admin picker. `slug` is the canonical stored value.
 */
export const ICON_CATALOG: IconCatalogEntry[] = [
  // Status
  { slug: 'check', label: 'Check', icon: Check, group: 'Status' },
  { slug: 'square-check', label: 'Square Check', icon: SquareCheck, group: 'Status' },
  { slug: 'square', label: 'Square Empty', icon: Square, group: 'Status' },
  { slug: 'circle-check', label: 'Circle Check', icon: CircleCheck, group: 'Status' },
  { slug: 'circle-dashed', label: 'Circle Dashed', icon: CircleDashed, group: 'Status' },
  { slug: 'circle-dot', label: 'Circle Dot', icon: CircleDot, group: 'Status' },
  { slug: 'x', label: 'X', icon: X, group: 'Status' },
  { slug: 'x-circle', label: 'X Circle', icon: XCircle, group: 'Status' },
  { slug: 'circle-x', label: 'Circle X', icon: CircleX, group: 'Status' },
  { slug: 'ban', label: 'Ban', icon: Ban, group: 'Status' },
  { slug: 'hourglass', label: 'Hourglass', icon: Hourglass, group: 'Status' },
  { slug: 'loader', label: 'Loader', icon: Loader, group: 'Status' },

  // Alerts & Safety
  { slug: 'triangle-alert', label: 'Warning', icon: TriangleAlert, group: 'Alerts' },
  { slug: 'octagon-alert', label: 'Danger', icon: OctagonAlert, group: 'Alerts' },
  { slug: 'circle-alert', label: 'Alert', icon: CircleAlert, group: 'Alerts' },
  { slug: 'circle-help', label: 'Help', icon: CircleHelp, group: 'Alerts' },
  { slug: 'info', label: 'Info', icon: Info, group: 'Alerts' },
  { slug: 'shield', label: 'Shield', icon: Shield, group: 'Alerts' },
  { slug: 'shield-alert', label: 'Shield Alert', icon: ShieldAlert, group: 'Alerts' },
  { slug: 'shield-check', label: 'Shield Check', icon: ShieldCheck, group: 'Alerts' },
  { slug: 'flame', label: 'Flame', icon: Flame, group: 'Alerts' },
  { slug: 'siren', label: 'Siren', icon: Siren, group: 'Alerts' },

  // Actions
  { slug: 'play', label: 'Play', icon: Play, group: 'Actions' },
  { slug: 'pause', label: 'Pause', icon: Pause, group: 'Actions' },
  { slug: 'stop-circle', label: 'Stop', icon: StopCircle, group: 'Actions' },
  { slug: 'circle-play', label: 'Circle Play', icon: CirclePlay, group: 'Actions' },
  { slug: 'skip-forward', label: 'Skip Forward', icon: SkipForward, group: 'Actions' },
  { slug: 'skip-back', label: 'Skip Back', icon: SkipBack, group: 'Actions' },
  { slug: 'power', label: 'Power', icon: Power, group: 'Actions' },
  { slug: 'lock', label: 'Lock', icon: Lock, group: 'Actions' },
  { slug: 'zap', label: 'Zap', icon: Zap, group: 'Actions' },
  { slug: 'bolt', label: 'Bolt', icon: Bolt, group: 'Actions' },
  { slug: 'refresh', label: 'Refresh', icon: RefreshCw, group: 'Actions' },
  { slug: 'rotate', label: 'Rotate', icon: RotateCw, group: 'Actions' },
  { slug: 'trash', label: 'Trash', icon: Trash2, group: 'Actions' },
  { slug: 'search', label: 'Search', icon: Search, group: 'Actions' },
  { slug: 'eye', label: 'Eye', icon: Eye, group: 'Actions' },
  { slug: 'eye-off', label: 'Eye Off', icon: EyeOff, group: 'Actions' },
  { slug: 'target', label: 'Target', icon: Target, group: 'Actions' },

  // Editing & I/O
  { slug: 'pencil', label: 'Pencil', icon: Pencil, group: 'Editing' },
  { slug: 'edit', label: 'Edit', icon: Edit, group: 'Editing' },
  { slug: 'copy', label: 'Copy', icon: Copy, group: 'Editing' },
  { slug: 'save', label: 'Save', icon: Save, group: 'Editing' },
  { slug: 'download', label: 'Download', icon: Download, group: 'Editing' },
  { slug: 'upload', label: 'Upload', icon: Upload, group: 'Editing' },
  { slug: 'send', label: 'Send', icon: Send, group: 'Editing' },
  { slug: 'share', label: 'Share', icon: Share2, group: 'Editing' },
  { slug: 'filter', label: 'Filter', icon: Filter, group: 'Editing' },
  { slug: 'paperclip', label: 'Paperclip', icon: Paperclip, group: 'Editing' },
  { slug: 'maximize', label: 'Maximize', icon: Maximize, group: 'Editing' },
  { slug: 'minimize', label: 'Minimize', icon: Minimize, group: 'Editing' },

  // Arrows & Navigation
  { slug: 'arrow-up', label: 'Arrow Up', icon: ArrowUp, group: 'Arrows' },
  { slug: 'arrow-down', label: 'Arrow Down', icon: ArrowDown, group: 'Arrows' },
  { slug: 'arrow-left', label: 'Arrow Left', icon: ArrowLeft, group: 'Arrows' },
  { slug: 'arrow-right', label: 'Arrow Right', icon: ArrowRight, group: 'Arrows' },
  { slug: 'chevron-up', label: 'Chevron Up', icon: ChevronUp, group: 'Arrows' },
  { slug: 'chevron-down', label: 'Chevron Down', icon: ChevronDown, group: 'Arrows' },
  { slug: 'chevron-left', label: 'Chevron Left', icon: ChevronLeft, group: 'Arrows' },
  { slug: 'chevron-right', label: 'Chevron Right', icon: ChevronRight, group: 'Arrows' },
  { slug: 'circle-arrow-up', label: 'Circle Arrow Up', icon: CircleArrowUp, group: 'Arrows' },
  { slug: 'circle-arrow-down', label: 'Circle Arrow Down', icon: CircleArrowDown, group: 'Arrows' },
  { slug: 'circle-arrow-left', label: 'Circle Arrow Left', icon: CircleArrowLeft, group: 'Arrows' },
  { slug: 'circle-arrow-right', label: 'Circle Arrow Right', icon: CircleArrowRight, group: 'Arrows' },
  { slug: 'move-vertical', label: 'Move Vertical', icon: MoveVertical, group: 'Arrows' },
  { slug: 'move-horizontal', label: 'Move Horizontal', icon: MoveHorizontal, group: 'Arrows' },
  { slug: 'external-link', label: 'External Link', icon: ExternalLink, group: 'Arrows' },
  { slug: 'link', label: 'Link', icon: Link, group: 'Arrows' },

  // Tools & Measurement
  { slug: 'gauge', label: 'Gauge', icon: Gauge, group: 'Tools' },
  { slug: 'wrench', label: 'Wrench', icon: Wrench, group: 'Tools' },
  { slug: 'settings', label: 'Settings', icon: Settings, group: 'Tools' },
  { slug: 'settings-2', label: 'Settings 2', icon: Settings2, group: 'Tools' },
  { slug: 'hammer', label: 'Hammer', icon: Hammer, group: 'Tools' },
  { slug: 'drill', label: 'Drill', icon: Drill, group: 'Tools' },
  { slug: 'ruler', label: 'Ruler', icon: Ruler, group: 'Tools' },
  { slug: 'scale', label: 'Scale', icon: Scale, group: 'Tools' },
  { slug: 'scissors', label: 'Scissors', icon: Scissors, group: 'Tools' },
  { slug: 'magnet', label: 'Magnet', icon: Magnet, group: 'Tools' },
  { slug: 'hard-hat', label: 'Hard Hat', icon: HardHat, group: 'Tools' },
  { slug: 'calculator', label: 'Calculator', icon: Calculator, group: 'Tools' },
  { slug: 'thermometer', label: 'Thermometer', icon: Thermometer, group: 'Tools' },
  { slug: 'timer', label: 'Timer', icon: Timer, group: 'Tools' },
  { slug: 'clock', label: 'Clock', icon: Clock, group: 'Tools' },
  { slug: 'alarm-clock', label: 'Alarm Clock', icon: AlarmClock, group: 'Tools' },
  { slug: 'lightbulb', label: 'Lightbulb', icon: Lightbulb, group: 'Tools' },
  { slug: 'beaker', label: 'Beaker', icon: Beaker, group: 'Tools' },
  { slug: 'flask-conical', label: 'Flask', icon: FlaskConical, group: 'Tools' },
  { slug: 'pipette', label: 'Pipette', icon: Pipette, group: 'Tools' },
  { slug: 'terminal', label: 'Terminal', icon: Terminal, group: 'Tools' },

  // Objects & Files
  { slug: 'home', label: 'Home', icon: Home, group: 'Objects' },
  { slug: 'user', label: 'User', icon: User, group: 'Objects' },
  { slug: 'users', label: 'Users', icon: Users, group: 'Objects' },
  { slug: 'user-check', label: 'User Check', icon: UserCheck, group: 'Objects' },
  { slug: 'bottle', label: 'Bottle', icon: GlassWater, group: 'Objects' },
  { slug: 'book-open', label: 'Book Open', icon: BookOpen, group: 'Objects' },
  { slug: 'book', label: 'Book', icon: Book, group: 'Objects' },
  { slug: 'file-text', label: 'File Text', icon: FileText, group: 'Objects' },
  { slug: 'file', label: 'File', icon: File, group: 'Objects' },
  { slug: 'files', label: 'Files', icon: Files, group: 'Objects' },
  { slug: 'folder', label: 'Folder', icon: Folder, group: 'Objects' },
  { slug: 'folder-open', label: 'Folder Open', icon: FolderOpen, group: 'Objects' },
  { slug: 'printer', label: 'Printer', icon: Printer, group: 'Objects' },
  { slug: 'camera', label: 'Camera', icon: Camera, group: 'Objects' },
  { slug: 'video', label: 'Video', icon: Video, group: 'Objects' },
  { slug: 'image', label: 'Image', icon: Image, group: 'Objects' },
  { slug: 'images', label: 'Images', icon: Images, group: 'Objects' },
  { slug: 'key-round', label: 'Key', icon: KeyRound, group: 'Objects' },

  // Data & Charts
  { slug: 'chart-bar', label: 'Chart Bar', icon: BarChart3, group: 'Data' },
  { slug: 'chart-line', label: 'Chart Line', icon: ChartLine, group: 'Data' },
  { slug: 'pie-chart', label: 'Pie Chart', icon: PieChart, group: 'Data' },
  { slug: 'activity', label: 'Activity', icon: Activity, group: 'Data' },
  { slug: 'trending-up', label: 'Trending Up', icon: TrendingUp, group: 'Data' },
  { slug: 'trending-down', label: 'Trending Down', icon: TrendingDown, group: 'Data' },
  { slug: 'ratio', label: 'Ratio', icon: Ratio, group: 'Data' },
  { slug: 'database', label: 'Database', icon: Database, group: 'Data' },
  { slug: 'cpu', label: 'CPU', icon: Cpu, group: 'Data' },
  { slug: 'hard-drive', label: 'Hard Drive', icon: HardDrive, group: 'Data' },
  { slug: 'server', label: 'Server', icon: Server, group: 'Data' },
  { slug: 'monitor', label: 'Monitor', icon: Monitor, group: 'Data' },
  { slug: 'smartphone', label: 'Smartphone', icon: Smartphone, group: 'Data' },

  // Communication
  { slug: 'mail', label: 'Mail', icon: Mail, group: 'Communication' },
  { slug: 'message-circle', label: 'Message Circle', icon: MessageCircle, group: 'Communication' },
  { slug: 'message-square', label: 'Message Square', icon: MessageSquare, group: 'Communication' },
  { slug: 'phone', label: 'Phone', icon: Phone, group: 'Communication' },
  { slug: 'bell', label: 'Bell', icon: Bell, group: 'Communication' },
  { slug: 'bell-off', label: 'Bell Off', icon: BellOff, group: 'Communication' },
  { slug: 'mic', label: 'Mic', icon: Mic, group: 'Communication' },
  { slug: 'mic-off', label: 'Mic Off', icon: MicOff, group: 'Communication' },
  { slug: 'volume-2', label: 'Volume', icon: Volume2, group: 'Communication' },
  { slug: 'volume-x', label: 'Volume Off', icon: VolumeX, group: 'Communication' },
  { slug: 'clipboard', label: 'Clipboard', icon: Clipboard, group: 'Communication' },
  { slug: 'clipboard-list', label: 'Clipboard List', icon: ClipboardList, group: 'Communication' },

  // Logistics & Commerce
  { slug: 'package', label: 'Package', icon: Package, group: 'Logistics' },
  { slug: 'package-open', label: 'Package Open', icon: PackageOpen, group: 'Logistics' },
  { slug: 'box', label: 'Box', icon: Box, group: 'Logistics' },
  { slug: 'boxes', label: 'Boxes', icon: Boxes, group: 'Logistics' },
  { slug: 'truck', label: 'Truck', icon: Truck, group: 'Logistics' },
  { slug: 'shopping-cart', label: 'Shopping Cart', icon: ShoppingCart, group: 'Logistics' },
  { slug: 'tag', label: 'Tag', icon: Tag, group: 'Logistics' },
  { slug: 'tags', label: 'Tags', icon: Tags, group: 'Logistics' },
  { slug: 'credit-card', label: 'Credit Card', icon: CreditCard, group: 'Logistics' },
  { slug: 'dollar-sign', label: 'Dollar', icon: DollarSign, group: 'Logistics' },
  { slug: 'battery', label: 'Battery', icon: Battery, group: 'Logistics' },

  // Location
  { slug: 'map', label: 'Map', icon: Map, group: 'Location' },
  { slug: 'map-pin', label: 'Map Pin', icon: MapPin, group: 'Location' },
  { slug: 'pin', label: 'Pin', icon: Pin, group: 'Location' },
  { slug: 'compass', label: 'Compass', icon: Compass, group: 'Location' },
  { slug: 'navigation', label: 'Navigation', icon: Navigation, group: 'Location' },
  { slug: 'globe', label: 'Globe', icon: Globe, group: 'Location' },
  { slug: 'flag', label: 'Flag', icon: Flag, group: 'Location' },
  { slug: 'wifi', label: 'Wifi', icon: Wifi, group: 'Location' },
  { slug: 'cloud', label: 'Cloud', icon: Cloud, group: 'Location' },
  { slug: 'cloud-off', label: 'Cloud Off', icon: CloudOff, group: 'Location' },

  // Feedback
  { slug: 'thumbs-up', label: 'Thumbs Up', icon: ThumbsUp, group: 'Feedback' },
  { slug: 'thumbs-down', label: 'Thumbs Down', icon: ThumbsDown, group: 'Feedback' },
  { slug: 'star', label: 'Star', icon: Star, group: 'Feedback' },
  { slug: 'heart', label: 'Heart', icon: Heart, group: 'Feedback' },
  { slug: 'smile', label: 'Smile', icon: Smile, group: 'Feedback' },
  { slug: 'award', label: 'Award', icon: Award, group: 'Feedback' },
  { slug: 'trophy', label: 'Trophy', icon: Trophy, group: 'Feedback' },
  { slug: 'gem', label: 'Gem', icon: Gem, group: 'Feedback' },
  { slug: 'bookmark', label: 'Bookmark', icon: Bookmark, group: 'Feedback' },

  // Layout
  { slug: 'grid', label: 'Grid', icon: Grid3x3, group: 'Layout' },
  { slug: 'layout-grid', label: 'Layout Grid', icon: LayoutGrid, group: 'Layout' },
  { slug: 'layout-list', label: 'Layout List', icon: LayoutList, group: 'Layout' },
  { slug: 'list', label: 'List', icon: List, group: 'Layout' },
  { slug: 'list-checks', label: 'List Checks', icon: ListChecks, group: 'Layout' },
  { slug: 'menu', label: 'Menu', icon: Menu, group: 'Layout' },
  { slug: 'grip', label: 'Grip', icon: Grip, group: 'Layout' },
  { slug: 'grip-vertical', label: 'Grip Vertical', icon: GripVertical, group: 'Layout' },
  { slug: 'calendar', label: 'Calendar', icon: Calendar, group: 'Layout' },

  // Shapes
  { slug: 'circle', label: 'Circle', icon: Circle, group: 'Shapes' },
  { slug: 'triangle', label: 'Triangle', icon: Triangle, group: 'Shapes' },
  { slug: 'hexagon', label: 'Hexagon', icon: Hexagon, group: 'Shapes' },
  { slug: 'plus', label: 'Plus', icon: Plus, group: 'Shapes' },
  { slug: 'minus', label: 'Minus', icon: Minus, group: 'Shapes' },
];

/** Lucide slug → Lucide component. Derived from the catalog. */
export const LUCIDE_ICONS: Record<string, LucideIconData> = Object.fromEntries(
  ICON_CATALOG.map((e) => [e.slug, e.icon]),
);

/**
 * Legacy FontAwesome / icomoon class → canonical slug. Used to resolve any
 * un-migrated rows and by the one-shot migration script.
 */
export const LEGACY_ICON_CLASSES: Record<string, string> = {
  // FontAwesome
  'fa fa-check': 'check',
  'fa fa-check-square': 'square-check',
  'fa fa-exclamation-triangle': 'triangle-alert',
  'fa fa-exclamation-circle': 'circle-alert',
  'fa fa-times': 'x',
  'fa fa-times-circle': 'x-circle',
  'fa fa-ban': 'ban',
  'fa fa-bolt': 'bolt',
  'fa fa-cog': 'settings',
  'fa fa-wrench': 'wrench',
  'fa fa-user': 'user',
  'fa fa-power-off': 'power',
  'fa fa-play': 'play',
  'fa fa-lock': 'lock',
  'fas fa-tachometer-alt': 'gauge',
  'far fa-check-square': 'square',
  'far fa-clock': 'clock',
  'far fa-chart-bar': 'chart-bar',
  'fa fa-chevron-up': 'chevron-up',
  'fa fa-chevron-down': 'chevron-down',
  // Icomoon
  'iconm-home': 'home',
  'iconm-home2': 'home',
  'iconm-home3': 'home',
  'iconm-home4': 'home',
  'iconm-arrow-up': 'arrow-up',
  'iconm-arrow-down': 'arrow-down',
  'iconm-arrow-up2': 'arrow-up',
  'iconm-arrow-down2': 'arrow-down',
  'iconm-circle-up': 'circle-arrow-up',
  'iconm-circle-down': 'circle-arrow-down',
  'iconm-thumbs-up': 'thumbs-up',
  'iconm-thumbs-down': 'thumbs-down',
  'iconm-bottle3': 'bottle',
};

/** Back-compat alias. Primary name is `LUCIDE_ICONS`. */
export const ICON_MAP = LUCIDE_ICONS;

/** Fallback icon when the value is unknown or empty. */
export const FALLBACK_ICON: LucideIconData = Info;

/** Catalog/default display icon. */
export const CATALOG_ICON: LucideIconData = BookOpen;

/**
 * Resolve any stored icon value (Lucide slug OR legacy FA/icomoon class) to a
 * Lucide component. Keeps pages rendering correctly before and after migration.
 */
export function resolveIcon(value?: string | null): LucideIconData {
  if (!value) return FALLBACK_ICON;
  const direct = LUCIDE_ICONS[value];
  if (direct) return direct;
  const slug = LEGACY_ICON_CLASSES[value];
  if (slug && LUCIDE_ICONS[slug]) return LUCIDE_ICONS[slug];
  return FALLBACK_ICON;
}

/**
 * Resolve a stored value to its canonical Lucide slug (or null if unknown).
 * Used by the picker to highlight the current selection.
 */
export function resolveIconSlug(value?: string | null): string | null {
  if (!value) return null;
  if (LUCIDE_ICONS[value]) return value;
  return LEGACY_ICON_CLASSES[value] ?? null;
}

/** Legacy CSS color class → hex. */
export const COLOR_MAP: Record<string, string> = {
  'color-primary': '#16A34A',
  primary: '#16A34A',
  'color-secondary-dark': '#1E3A2F',
  'secondary-dark': '#1E3A2F',
  'color-secondary-light': '#86EFAC',
  'secondary-light': '#86EFAC',
  'color-grey-dark': '#4B5563',
  'grey-dark': '#4B5563',
  'color-grey-medium': '#6B7280',
  'grey-medium': '#6B7280',
  'color-grey-light': '#D1D5DB',
  'grey-light': '#D1D5DB',
  'color-white': '#FFFFFF',
  white: '#FFFFFF',
  'color-blue': '#3B82F6',
  blue: '#3B82F6',
  'color-green': '#22C55E',
  green: '#22C55E',
  'color-red': '#EF4444',
  red: '#EF4444',
  'color-orange': '#F59E0B',
  orange: '#F59E0B',
  'color-purple': '#A855F7',
  purple: '#A855F7',
};

/** Default foreground color when no value is supplied. */
export const DEFAULT_FG = '#6B7280';

/** Default background color when no value is supplied. */
export const DEFAULT_BG = 'transparent';

/** Legacy shape class → Tailwind border-radius utility. */
export const SHAPE_RADIUS: Record<string, string> = {
  'btn-circle': 'rounded-full',
  'sml-circle': 'rounded-full',
  'btn-rounded': 'rounded-md',
  'sml-rounded': 'rounded-md',
  'btn-square': 'rounded-sm',
  'sml-square': 'rounded-sm',
  'in stock': 'rounded-full',
};

/** Resolve a color value to a CSS color; falls back to the raw string if unknown. */
export function resolveColor(color?: string | null, fallback: string = DEFAULT_FG): string {
  if (!color) return fallback;
  return COLOR_MAP[color] ?? color;
}
