// ── Lightbox ─────────────────────────────────────────────────────────────────
export {
  LightboxComponent,
  LightboxService,
  LightboxGalleryDirective,
  LightboxItemDirective,
} from './components/lightbox';
export { LightboxSwipeDirective } from './components/lightbox';
export type { SwipeEvent, DragMoveEvent } from './components/lightbox';
export {
  LIGHTBOX_EASING,
  lightboxVariants,
  lightboxBackdropVariants,
  lightboxToolbarVariants,
  lightboxToolbarBtnVariants,
  lightboxStageVariants,
  lightboxCaptionVariants,
} from './components/lightbox';
export type {
  LightboxItem,
  LightboxItemType,
  LightboxPin,
  LightboxOptions,
  LightboxRef,
  LightboxToolbarItem,
  ThumbPosition,
  ZoomClickAction,
  LightboxVariants,
} from './components/lightbox';

// Utilities
export { cn } from './utils/cn';
export { overlayEnter, overlayExit, type MotionPreset } from './utils/motion';
export type { Size, ColorVariant, Orientation } from './utils/types';
export {
  placeholderImage,
  PLACEHOLDER_DEFAULTS,
  type PlaceholderOptions,
  type PlaceholderFormat,
  type PlaceholderFont,
  type PlaceholderRatio,
} from './utils/placeholder';

// ── Icon Component ───────────────────────────────────────────────────────
export { IconComponent } from './components/icon';
export { iconVariants, type IconSize, ICON_SIZE_MAP } from './components/icon';

// ── Sprint 2: Simple Display Primitives ──────────────────────────────────
export {
  ButtonComponent,
  ButtonGroupComponent,
  ButtonGroupDividerComponent,
  ButtonGroupTextDirective,
  BUTTON_GROUP_TOKEN,
  buttonVariants,
  type ButtonVariants,
} from './components/button';
export { BadgeComponent, badgeVariants, type BadgeVariants } from './components/badge';
export { LabelComponent } from './components/label';
export { SeparatorComponent } from './components/separator';
export { SkeletonComponent } from './components/skeleton';
export { ProgressComponent } from './components/progress';
export { ProgressBarComponent } from './components/progress-bar';
export {
  AvatarComponent,
  AvatarImageComponent,
  AvatarFallbackComponent,
  AvatarGroupComponent,
} from './components/avatar';
export { AspectRatioComponent } from './components/aspect-ratio';

// ── Sprint 3: Form Input Primitives ──────────────────────────────────────────
export { InputComponent, InputWrapperComponent } from './components/input';
export { TextareaComponent } from './components/textarea';
export { ChipInputComponent } from './components/chip-input';
export {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
} from './components/card';
export {
  AlertComponent,
  AlertTitleComponent,
  AlertDescriptionComponent,
  alertVariants,
  type AlertVariants,
} from './components/alert';

// ── Sprint 4: Form Control Components ────────────────────────────────────────
export { CheckboxComponent } from './components/checkbox';
export { SwitchComponent } from './components/switch';
export { SwitchFilterComponent } from './components/switch-filter';
export { RadioGroupComponent, RadioGroupItemComponent, RADIO_GROUP_TOKEN } from './components/radio-group';
export { SliderComponent } from './components/slider';

// ── Sprint 5: Overlay Components ─────────────────────────────────────────────
export {
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
  DIALOG_TOKEN,
  type DialogSize,
  type DialogMode,
  DialogRef,
  DIALOG_DATA,
  type DialogConfig,
  DialogContainerComponent,
} from './components/dialog';
export {
  PopoverComponent,
  PopoverContentComponent,
  PopoverTriggerDirective,
  POPOVER_TOKEN,
} from './components/popover';
export {
  TooltipComponent,
  TooltipContentComponent,
  TooltipTriggerDirective,
  TOOLTIP_TOKEN,
  resolveTooltipDelay,
  type TooltipDelayPreset,
} from './components/tooltip';
export {
  HoverCardComponent,
  HoverCardContentComponent,
  HoverCardTriggerDirective,
  HOVER_CARD_TOKEN,
} from './components/hover-card';

// ── Sprint 6: Menu & Command ──────────────────────────────────────────────────
export {
  ContextMenuComponent,
  ContextMenuTriggerDirective,
  ContextMenuContentComponent,
  ContextMenuGroupComponent,
  ContextMenuLabelComponent,
  ContextMenuItemComponent,
  ContextMenuSeparatorComponent,
  ContextMenuShortcutComponent,
  CONTEXT_MENU_TOKEN,
} from './components/context-menu';
export {
  SelectComponent,
  SelectTriggerComponent,
  SelectValueComponent,
  SelectContentComponent,
  SelectGroupComponent,
  SelectLabelComponent,
  SelectItemComponent,
  SelectSeparatorComponent,
  SELECT_TOKEN,
  type SelectOption,
} from './components/select';
export {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandEmptyComponent,
  CommandGroupComponent,
  CommandSeparatorComponent,
  CommandItemComponent,
  CommandShortcutComponent,
  COMMAND_TOKEN,
} from './components/command';

// ── Sprint 7: Navigation & Content ───────────────────────────────────────────
export {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
  TABS_TOKEN,
} from './components/tabs';
export {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
  ACCORDION_TOKEN,
  ACCORDION_ITEM_TOKEN,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentInnerVariants,
  type AccordionVariant,
  type AccordionSize,
} from './components/accordion';
export {
  CollapsibleComponent,
  CollapsibleTriggerDirective,
  CollapsibleContentComponent,
  COLLAPSIBLE_TOKEN,
} from './components/collapsible';
export { ScrollAreaComponent, ScrollBarComponent } from './components/scroll-area';
export {
  MenubarComponent,
  MenubarMenuComponent,
  MenubarTriggerComponent,
  MenubarContentComponent,
  MenubarItemComponent,
  MenubarSeparatorComponent,
  MenubarLabelComponent,
  MenubarShortcutComponent,
  MENUBAR_TOKEN,
  MENUBAR_MENU_TOKEN,
} from './components/menubar';
export {
  NavigationMenuComponent,
  NavigationMenuListComponent,
  NavigationMenuItemComponent,
  NavigationMenuTriggerComponent,
  NavigationMenuContentComponent,
  NavigationMenuLinkDirective,
  NAV_MENU_TOKEN,
  NAV_MENU_ITEM_TOKEN,
} from './components/navigation-menu';

// ── Sprint 8: Services & Utilities ───────────────────────────────────────────
export {
  ThemeService,
  type ThemeMode,
  type Theme,
  BreadcrumbService,
  SidebarService,
  DialogService,
  ToastService,
  type Toast,
} from './services';
export { ThemeToggleComponent } from './components/theme-toggle';
export {
  ToasterComponent,
  ToastItemComponent,
  ToastProgressComponent,
  ToastStateService,
  toast,
  type ToastItem,
  type ToastOptions,
  type ToasterPosition,
  type ToastProgressType,
  type ToastType,
  type ToastVariant,
  type ToastAction,
} from './components/toast';
export {
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkDirective,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
  BreadcrumbEllipsisComponent,
} from './components/breadcrumb';
export {
  PaginationComponent,
  PaginationContentComponent,
  PaginationItemComponent,
  PaginationLinkDirective,
  PaginationPreviousComponent,
  PaginationNextComponent,
  PaginationEllipsisComponent,
  PAGINATION_TOKEN,
} from './components/pagination';

// ── Sprint 9: Composed & Layout ───────────────────────────────────────────────
export {
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableFooterComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  TableCaptionComponent,
  TABLE_TOKEN,
  type DataTableSort,
  type DataTablePage,
} from './components/table';
export {
  SidebarComponent,
  SidebarTriggerDirective,
  SidebarHeaderComponent,
  SidebarContentComponent,
  SidebarFooterComponent,
  SidebarMenuComponent,
  SidebarMenuItemComponent,
  SidebarMenuButtonComponent,
  SidebarGroupComponent,
  SidebarGroupLabelComponent,
  SIDEBAR_TOKEN,
} from './components/sidebar';
export {
  DrawerComponent,
  DrawerTriggerDirective,
  DrawerCloseDirective,
  DrawerContentComponent,
  DrawerHeaderComponent,
  DrawerFooterComponent,
  DrawerTitleComponent,
  DrawerDescriptionComponent,
  DRAWER_TOKEN,
  DrawerService,
  DRAWER_DATA,
  type DrawerConfig,
  type DrawerEntry,
} from './components/drawer';

// ── Sprint 2 additions ────────────────────────────────────────────────────────
export {
  ThemeSelectorComponent,
  type ThemePreset,
  type AccentColor,
  type FontOption,
} from './components/theme-selector';

// ── Sprint 3: Form Components ─────────────────────────────────────────────────
export {
  InputGroupComponent,
  InputAddonComponent,
  InputGroupSpinnerComponent,
  INPUT_GROUP_TOKEN,
} from './components/input-group';
export { InputNumberComponent } from './components/input-number';
export { InputPinComponent } from './components/input-pin';
export { SearchboxComponent } from './components/searchbox';
export { RatingsComponent } from './components/ratings';
export { TogglePasswordComponent } from './components/toggle-password';
export { ToggleCountComponent } from './components/toggle-count';
export { StrongPasswordComponent, type PasswordRule } from './components/strong-password';
export { FileInputComponent } from './components/file-input';
export { FileUploadComponent, FileUploadProgressComponent, type UploadedFile } from './components/file-upload';
export { ColorPickerComponent, type ColorFormat } from './components/color-picker';
export { TimePickerComponent, type TimeFormat } from './components/time-picker';
export { DatePickerComponent } from './components/date-picker';
export {
  FormFieldComponent,
  FormControlComponent,
  FormMessageComponent,
  FORM_FIELD_TOKEN,
} from './components/form-field';

// ── Sprint 4: Display Components ─────────────────────────────────────────────
export { SpinnerComponent, type SpinnerSize } from './components/spinner';
export { KbdComponent } from './components/kbd';
export { BlockquoteComponent } from './components/blockquote';
export { LegendIndicatorComponent } from './components/legend-indicator';
export { IconStyledComponent } from './components/icon-styled';
export { ContainerComponent } from './components/container';
export { ProseComponent } from './components/prose';
export {
  ChatBubbleComponent,
  ChatBubbleAvatarComponent,
  ChatBubbleContentComponent,
  ChatBubbleTimestampComponent,
  ChatBubbleTypingComponent,
} from './components/chat-bubble';

// ── Sprint 5: Navigation Components ──────────────────────────────────────────
export { StepperComponent, type StepperStep, type StepStatus, type StepperOrientation } from './components/stepper';
export {
  NavbarComponent,
  NavbarBrandComponent,
  NavbarNavComponent,
  NavbarItemComponent,
  NavbarActionsComponent,
  NavbarToggleComponent,
} from './components/navbar';
export {
  MegaMenuComponent,
  MegaMenuItemComponent,
  MegaMenuTriggerDirective,
  MegaMenuContentComponent,
  MegaMenuTemplateDirective,
  MegaMenuSectionComponent,
  MegaMenuSectionTitleComponent,
  MegaMenuLinkComponent,
} from './components/mega-menu';

// ── Sprint 6:Exclusive Components ───────────────────────────────────────
export { DividerComponent } from './components/divider';
export { StateComponent, type StateType } from './components/state';
export { ToggleComponent } from './components/toggle';
export {
  ToggleGroupComponent,
  ToggleGroupItemComponent,
  TOGGLE_GROUP_TOKEN,
  type ToggleGroupMode,
} from './components/toggle-group';
export { SegmentedComponent, type SegmentedOption } from './components/segmented';
export { QuickFilterComponent, type QuickFilterButton } from './components/quick-filter';
export { ComboboxComponent, type ComboboxOption } from './components/combobox';
export { CalendarComponent, type CalendarMode, type DateRange } from './components/calendar';
export { ResizableComponent, ResizablePanelComponent, ResizableHandleComponent } from './components/resizable';
export { TreeComponent, TreeNodeComponent, type TreeNode } from './components/tree';
export { ImageRadioGroupComponent, type ImageRadioOption } from './components/image-radio-group';
export { HelpImageComponent } from './components/help-image';

// ── Sprint 7: Data Display Components ────────────────────────────────────────
export { ListGroupComponent, ListGroupItemComponent, LIST_GROUP_TOKEN } from './components/list-group';

// ── Sprint 8: Advanced / Layout Components ────────────────────────────────────
export {
  CarouselComponent,
  CarouselContentComponent,
  CarouselItemComponent,
  CarouselPrevComponent,
  CarouselNextComponent,
  CarouselDotsComponent,
  CarouselCounterComponent,
  CarouselProgressComponent,
  CarouselThumbsComponent,
  CarouselThumbItemComponent,
  CAROUSEL_TOKEN,
  CAROUSEL_THUMBS_TOKEN,
} from './components/carousel';
export type {
  CarouselProgressSize,
  CarouselThumbSize,
  CarouselThumbType,
  CarouselThumbsApi,
  CarouselDotsVariant,
} from './components/carousel';
export { ThumbsGalleryComponent } from './components/carousel';
export { CarouselPluginService } from './components/carousel';
export type {
  CarouselApi,
  CarouselPluginConfig,
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
  EmblaEventType,
} from './components/carousel';
export {
  TimelineComponent,
  TimelineItemComponent,
  TimelineIconComponent,
  TimelineContentComponent,
  TIMELINE_TOKEN,
  type TimelineIconSize,
  type TimelineIconVariant,
} from './components/timeline';
export { GridComponent, ColumnComponent } from './components/grid';

// ── Compatibility aliases ────────────────────────────────────────────────────
export { BreadcrumbLinkDirective as BreadcrumbLinkComponent } from './components/breadcrumb';
export { PaginationLinkDirective as PaginationLinkComponent } from './components/pagination';
export { DialogCloseDirective as DialogCloseComponent } from './components/dialog';

// ── Sprint 9: Directives ──────────────────────────────────────────────────────
export { ScrollspyDirective } from './directives/scrollspy.directive';
export { CollapseDirective } from './directives/collapse.directive';
export { ScrollbarDirective, type ScrollbarSize } from './directives/scrollbar.directive';
export { TooltipDirective, type TooltipPlacement } from './directives/tooltip.directive';
export { BusyDirective } from './directives/busy.directive';

// ── Loading bar ──────────────────────────────────────────────────────────────
export { LoadingBarComponent } from './components/loading-bar';
export { LoadingBarService } from './services/loading-bar.service';

// ── Dropdown ─────────────────────────────────────────────────────────────────
export {
  DropdownComponent,
  DropdownTriggerDirective,
  DropdownContentDirective,
  DropdownItemComponent,
  DropdownGroupComponent,
  DropdownLabelComponent,
  DropdownSeparatorComponent,
  DropdownShortcutComponent,
  DROPDOWN_TOKEN,
  type DropdownItem,
} from './components/dropdown';

// ── Layouts ───────────────────────────────────────────────────────────────────
export {
  AdminShellComponent,
  AdminUserMenuDirective,
  type AdminNavItem,
  type AdminNavChild,
  type AdminBreadcrumb,
  FrontendShellComponent,
} from './layouts';

// ── Feature Components ──────────────────────────────────────────────────────
export {
  FeaturesFileUploadComponent,
  FileUploadService,
  API_BASE_URL,
  type UploadType,
  type UploadQueueItem,
  type UploadResultEvent,
  type UploadErrorEvent,
  type SignedUrlResponse,
  type ConfirmResponse,
} from './features/file-upload';
export {
  EntityBrowseDialogComponent,
  type EntityBrowseDialogData,
  type EntityBrowseDialogResult,
  type EntityBrowseItem,
} from './features/entity-browse-dialog';
export { ManualViewComponent } from './features/manual-view';
export {
  IconPreviewComponent,
  IconPickerComponent,
  ICON_MAP,
  LUCIDE_ICONS,
  LEGACY_ICON_CLASSES,
  ICON_CATALOG,
  COLOR_MAP,
  SHAPE_RADIUS,
  FALLBACK_ICON,
  CATALOG_ICON,
  DEFAULT_FG,
  DEFAULT_BG,
  resolveIcon,
  resolveIconSlug,
  resolveColor,
  type IconCatalogEntry,
} from './features/icon-preview';
export { PdfViewerComponent } from './features/pdf-viewer';
export { VideoCategorySectionComponent, type VideoCategory } from './features/video-category-section';
export { VideoPlayerComponent, type VideoItem, type VideoPlayerData } from './features/video-player';
export { VideoPlayerDialogComponent, type VideoPlayerDialogData } from './features/video-player-dialog';
export { VideoThumbnailCardComponent } from './features/video-thumbnail-card';
export {
  TableDataComponent,
  TableDataActionsDirective,
  TableDataInlineFiltersDirective,
  TableDataHeaderLeftDirective,
  TableDataAfterToolbarDirective,
  TableDataHeaderComponent,
  TableDataTableComponent,
  TableDataFooterComponent,
  TableDataColumnDrawerComponent,
  TableDataFilterDrawerComponent,
  TableDataSelectionBarComponent,
  type ColumnOverrideState,
  CellAvatarGroupComponent,
  type AvatarGroupItem,
  CellCompanyComponent,
  CellContactComponent,
  CellFlagLocationComponent,
  CellStatusPillComponent,
  avatarBgFromName,
  type TableDataBulkUpdate,
  type TableDataColumn,
  type TableDataCellType,
  type TableDataCellData,
  type TableDataEditType,
  type TableDataStatusColor,
  type TableDataFilterOverride,
  type TableDataFilterType,
  type TableDataTab,
  type TableDataFilterSection,
  type TableDataFilterSelectOption,
  type TableDataFilterState,
  type TableDataFilterValue,
  type TableDataRangeValue,
  type TableDataCustomAction,
  type TableDataRowAction,
  type TableDataSort,
  type SortDirection,
  isFilterActive,
  detectFilterType,
  extractUniqueValues,
} from './features/table-data';
export {
  GroupSelectComponent,
  GROUP_SELECT_DATA_PROVIDER,
  type GroupSelectDataProvider,
  type GroupSelectNode,
} from './features/group-select';

// ── M142: Shared Contact Picker + Contact Form Dialogs ─────────────────────
export { ContactPickerDialogComponent } from './components/contact-picker-dialog';
export { ContactFormDialogComponent, type ContactFormMode } from './components/contact-form-dialog';
export type { ContactPublic, CustomerContactLinkPublic, CompanyContactFormDto } from './types/contact';
