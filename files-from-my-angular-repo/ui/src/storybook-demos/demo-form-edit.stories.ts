// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';

// App shell
import {
  NavbarComponent,
  NavbarBrandComponent,
  NavbarNavComponent,
  NavbarItemComponent,
  NavbarActionsComponent,
  NavbarToggleComponent,
} from '../components/navbar/navbar.component';
import {
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkDirective,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
} from '../components/breadcrumb/breadcrumb.component';

// Forms
import { LabelComponent } from '../components/label/label.directive';
import { InputComponent } from '../components/input/input.component';
import { TextareaComponent } from '../components/textarea/textarea.component';
import {
  SelectComponent,
  SelectTriggerComponent,
  SelectValueComponent,
  SelectContentComponent,
  SelectItemComponent,
} from '../components/select/select.component';
import { CheckboxComponent } from '../components/checkbox/checkbox.component';
import { RadioGroupComponent, RadioGroupItemComponent } from '../components/radio-group/radio-group.component';

// Display
import { ButtonComponent } from '../components/button/button.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { SeparatorComponent } from '../components/separator/separator.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
} from '../components/card/card.component';
import { IconStyledComponent } from '../components/icon-styled/icon-styled.component';

// Media
import { FileUploadComponent } from '../components/file-upload/file-upload.component';
import { AspectRatioComponent } from '../components/aspect-ratio/aspect-ratio.component';

// Table
import {
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
} from '../components/table/table.component';

// Avatar
import { AvatarComponent, AvatarFallbackComponent } from '../components/avatar/avatar.component';

// Feedback
import { AlertComponent, AlertTitleComponent, AlertDescriptionComponent } from '../components/alert/alert.component';
import { ToasterComponent } from '../components/toast/toaster.component';
import { toast } from '../components/toast/toast.function';

// ─────────────────────────────────────────────────────────────────────────────

const ALL_IMPORTS = [
  // App shell
  NavbarComponent,
  NavbarBrandComponent,
  NavbarNavComponent,
  NavbarItemComponent,
  NavbarActionsComponent,
  NavbarToggleComponent,
  BreadcrumbComponent,
  BreadcrumbListComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkDirective,
  BreadcrumbPageComponent,
  BreadcrumbSeparatorComponent,
  // Forms
  LabelComponent,
  InputComponent,
  TextareaComponent,
  SelectComponent,
  SelectTriggerComponent,
  SelectValueComponent,
  SelectContentComponent,
  SelectItemComponent,
  CheckboxComponent,
  RadioGroupComponent,
  RadioGroupItemComponent,
  // Display
  ButtonComponent,
  BadgeComponent,
  SeparatorComponent,
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
  IconStyledComponent,
  // Media
  FileUploadComponent,
  AspectRatioComponent,
  // Table
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  // Avatar
  AvatarComponent,
  AvatarFallbackComponent,
  // Feedback
  AlertComponent,
  AlertTitleComponent,
  AlertDescriptionComponent,
  ToasterComponent,
];

const meta: Meta = {
  title: 'Demos/Form - Edit',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const FormEdit: Story = {
  name: 'Form - Edit',
  render: () => ({
    moduleMetadata: { imports: ALL_IMPORTS },
    props: {
      saveProduct: () => toast.success('Saved', { description: 'Precision Sensor - V4X has been updated.' }),
    },
    template: `
<div class="flex h-screen bg-muted/10 overflow-hidden">

  <ui-toaster position="bottom-right" [richColors]="true"></ui-toaster>

  <!-- ── Narrow icon sidebar ─────────────────────────────────────────────── -->
  <aside class="w-14 flex flex-col items-center py-3 gap-1 border-r border-border/30 bg-sidebar shrink-0">
    <div class="w-8 h-8 rounded-md bg-primary flex items-center justify-center mb-2">
      <span class="text-xs font-bold text-primary-foreground">L</span>
    </div>
    <ui-separator class="w-8 mb-1"></ui-separator>
    <button class="w-9 h-9 rounded-md bg-accent flex items-center justify-center text-foreground" title="Dashboard">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    </button>
    <button class="w-9 h-9 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground" title="Products">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>
    </button>
    <button class="w-9 h-9 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground" title="Orders">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    </button>
    <button class="w-9 h-9 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground" title="Analytics">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    </button>
    <button class="w-9 h-9 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground mt-auto" title="Settings">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
    </button>
  </aside>

  <!-- ── Main column ─────────────────────────────────────────────────────── -->
  <div class="flex-1 flex flex-col overflow-hidden">

    <!-- Top navbar -->
    <ui-navbar>
      <ui-navbar-brand>
        <span class="font-semibold text-sm text-foreground">Dashboard</span>
      </ui-navbar-brand>
      <ui-navbar-nav>
        <a uiNavbarItem [active]="true" href="#">Products</a>
      </ui-navbar-nav>
      <ui-navbar-actions>
        <div class="relative hidden sm:block">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input uiInput placeholder="Search..." class="pl-8 h-8 w-52 text-sm" />
        </div>
        <ui-button size="icon" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </ui-button>
        <ui-avatar size="sm"><ui-avatar-fallback>MK</ui-avatar-fallback></ui-avatar>
      </ui-navbar-actions>
      <ui-navbar-toggle></ui-navbar-toggle>
    </ui-navbar>

    <!-- Scrollable content -->
    <main class="flex-1 overflow-auto p-6">

      <!-- Page header row -->
      <div class="flex items-start justify-between gap-4 mb-6">
        <div>
          <ui-breadcrumb class="mb-2">
            <ui-breadcrumb-list>
              <ui-breadcrumb-item>
                <a uiBreadcrumbLink href="#">Dashboard</a>
              </ui-breadcrumb-item>
              <ui-breadcrumb-separator></ui-breadcrumb-separator>
              <ui-breadcrumb-item>
                <a uiBreadcrumbLink href="#">Products</a>
              </ui-breadcrumb-item>
            </ui-breadcrumb-list>
          </ui-breadcrumb>
          <h1 class="text-xl font-bold text-foreground">Precision Sensor - V4X</h1>
          <p class="text-sm text-muted-foreground mt-0.5">Manage product details, media, and technical specifications.</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <ui-badge variant="outline" color="info">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Followed
          </ui-badge>
          <ui-button variant="outline" size="sm">Discard Changes</ui-button>
          <ui-button size="sm" (click)="saveProduct()">Save Product</ui-button>
        </div>
      </div>

      <!-- 2-column layout -->
      <div class="grid grid-cols-[1fr_280px] gap-6 items-start">

        <!-- ── Left: main sections ──────────────────────────────────────── -->
        <div class="space-y-5">

          <!-- § General Information -->
          <ui-card>
            <ui-card-header>
              <div class="flex items-center gap-3">
                <ui-icon-styled variant="primary" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                </ui-icon-styled>
                <ui-card-title>General Information</ui-card-title>
              </div>
            </ui-card-header>
            <ui-card-content class="space-y-4">
              <div class="space-y-1.5">
                <label uiLabel for="p-name">Product Name</label>
                <input uiInput id="p-name" value="Precision Sensor - V4X" />
              </div>
              <div class="space-y-1.5">
                <label uiLabel for="p-desc">Description</label>
                <textarea uiTextarea id="p-desc" rows="4">High performance optical precision sensor designed for industrial automation pipelines. Featuring advanced ambient light filtering and 4K data throughput capability. Optimized for V4X architecture systems.</textarea>
              </div>
            </ui-card-content>
          </ui-card>

          <!-- § Media Assets -->
          <ui-card>
            <ui-card-header>
              <div class="flex items-center gap-3">
                <ui-icon-styled variant="primary" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </ui-icon-styled>
                <ui-card-title>Media Assets</ui-card-title>
              </div>
            </ui-card-header>
            <ui-card-content>
              <div class="grid grid-cols-2 gap-4">
                <ui-file-upload
                  accept="image/*"
                  hint="Supports JPG, PNG or SVG up to 50MB"
                  class="min-h-[120px]">
                </ui-file-upload>
                <ui-file-upload
                  accept=".pdf,.doc,.docx"
                  hint="Support for PDF, Word up to 50MB"
                  class="min-h-[120px]">
                </ui-file-upload>
              </div>
              <!-- Uploaded preview thumbnail -->
              <div class="mt-4 flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                <div class="w-16 h-16 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">sensor_v4x_front.jpg</p>
                  <p class="text-xs text-muted-foreground">2.4 MB · Uploaded Feb 28</p>
                </div>
                <ui-button size="icon" variant="ghost" class="ml-auto shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-destructive" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </ui-button>
              </div>
            </ui-card-content>
          </ui-card>

          <!-- § Technical Specifications -->
          <ui-card>
            <ui-card-header>
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <ui-icon-styled variant="primary" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h2M20 12h2M12 2v2M12 20v2"/><path d="m4.93 4.93 1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                  </ui-icon-styled>
                  <ui-card-title>Technical Specifications</ui-card-title>
                </div>
                <ui-button size="sm" variant="outline">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                  Add Spec
                </ui-button>
              </div>
            </ui-card-header>
            <ui-card-content class="p-0">
              <table uiTable>
                <thead uiTableHeader>
                  <tr uiTableRow>
                    <th uiTableHead>Specification</th>
                    <th uiTableHead>Value</th>
                  </tr>
                </thead>
                <tbody uiTableBody>
                  <tr uiTableRow>
                    <td uiTableCell class="font-medium">Operating Voltage</td>
                    <td uiTableCell class="text-muted-foreground">24V DC</td>
                  </tr>
                  <tr uiTableRow>
                    <td uiTableCell class="font-medium">Output Signal</td>
                    <td uiTableCell class="text-muted-foreground">4-20mA Analog</td>
                  </tr>
                  <tr uiTableRow>
                    <td uiTableCell class="font-medium">IP Rating</td>
                    <td uiTableCell class="text-muted-foreground">IP67 Waterproof</td>
                  </tr>
                </tbody>
              </table>
            </ui-card-content>
          </ui-card>

          <!-- § Engineering Data -->
          <ui-card>
            <ui-card-header>
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <ui-icon-styled variant="primary" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </ui-icon-styled>
                  <ui-card-title>Engineering Data</ui-card-title>
                </div>
                <ui-button size="sm" variant="outline">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                  Add File
                </ui-button>
              </div>
            </ui-card-header>
            <ui-card-content class="p-0">
              <table uiTable>
                <thead uiTableHeader>
                  <tr uiTableRow>
                    <th uiTableHead>File Name</th>
                    <th uiTableHead>Version</th>
                    <th uiTableHead>Last Modified</th>
                    <th uiTableHead>Status</th>
                    <th uiTableHead class="w-20"></th>
                  </tr>
                </thead>
                <tbody uiTableBody>
                  <tr uiTableRow>
                    <td uiTableCell>
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span class="text-sm font-medium">STEP_Sensor_V4X.zip</span>
                      </div>
                    </td>
                    <td uiTableCell class="text-muted-foreground text-sm">v2.41</td>
                    <td uiTableCell class="text-muted-foreground text-sm">Feb 15, 2022</td>
                    <td uiTableCell>
                      <ui-badge variant="soft" color="success">VERIFIED</ui-badge>
                    </td>
                    <td uiTableCell>
                      <ui-button size="sm" variant="ghost">Update</ui-button>
                    </td>
                  </tr>
                  <tr uiTableRow>
                    <td uiTableCell>
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span class="text-sm font-medium">Schematic_Draft.pdf</span>
                      </div>
                    </td>
                    <td uiTableCell class="text-muted-foreground text-sm">v3.1.0</td>
                    <td uiTableCell class="text-muted-foreground text-sm">Nov 30, 2023</td>
                    <td uiTableCell>
                      <ui-badge variant="soft" color="warning">PENDING</ui-badge>
                    </td>
                    <td uiTableCell>
                      <ui-button size="sm" variant="ghost">Update</ui-button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="px-4 py-3 border-t border-border">
                <button class="text-sm text-primary hover:underline">+ Upload New Engineering Asset</button>
              </div>
            </ui-card-content>
          </ui-card>

        </div><!-- /left -->

        <!-- ── Right sidebar ──────────────────────────────────────────── -->
        <div class="space-y-4">

          <!-- Status card -->
          <ui-card class="border-0">
            <ui-card-header>
              <ui-card-title class="text-sm">Status</ui-card-title>
            </ui-card-header>
            <ui-card-content class="space-y-3">
              <ui-select>
                <ui-select-trigger>
                  <ui-select-value placeholder="Select status…">Published</ui-select-value>
                </ui-select-trigger>
                <ui-select-content>
                  <ui-select-item value="published">Published</ui-select-item>
                  <ui-select-item value="draft">Draft</ui-select-item>
                  <ui-select-item value="archived">Archived</ui-select-item>
                </ui-select-content>
              </ui-select>
              <p class="text-xs text-muted-foreground">Visible in all public-facing product directories and search results.</p>
            </ui-card-content>
          </ui-card>

          <!-- Categorization card -->
          <ui-card class="border-0">
            <ui-card-header>
              <ui-card-title class="text-sm">Categorization</ui-card-title>
            </ui-card-header>
            <ui-card-content class="space-y-3">
              <div class="space-y-1.5">
                <label uiLabel class="text-xs">Department Category</label>
                <ui-select>
                  <ui-select-trigger>
                    <ui-select-value placeholder="Select…">Industrial Automation</ui-select-value>
                  </ui-select-trigger>
                  <ui-select-content>
                    <ui-select-item value="industrial">Industrial Automation</ui-select-item>
                    <ui-select-item value="robotics">Robotics</ui-select-item>
                    <ui-select-item value="sensors">Sensors &amp; Actuators</ui-select-item>
                  </ui-select-content>
                </ui-select>
              </div>
              <div class="space-y-1.5">
                <label uiLabel class="text-xs">Show Category</label>
                <input uiInput placeholder="Category display name" value="Industrial Automation" />
              </div>
              <div class="space-y-1.5">
                <label uiLabel class="text-xs">Range Tags</label>
                <div class="flex flex-wrap gap-1.5 p-2 rounded-md border border-input bg-background min-h-[38px]">
                  <ui-badge variant="outline" class="text-xs">CNC Series V</ui-badge>
                  <ui-badge variant="outline" class="text-xs">Sensor V</ui-badge>
                  <ui-badge variant="outline" class="text-xs">Sensor S</ui-badge>
                </div>
              </div>
              <div class="space-y-1.5">
                <label uiLabel class="text-xs">Add Tags</label>
                <input uiInput placeholder="Type and press Enter..." />
              </div>
            </ui-card-content>
          </ui-card>

          <!-- Related Manuals card -->
          <ui-card class="border-0">
            <ui-card-header>
              <ui-card-title class="text-sm">Related Manuals</ui-card-title>
            </ui-card-header>
            <ui-card-content class="space-y-2">
              <div class="flex items-center gap-2 py-1.5 rounded hover:bg-muted/50 px-1 -mx-1 cursor-pointer transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-destructive shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h3"/></svg>
                <span class="text-xs truncate">Installation_Guide_EN.pdf</span>
              </div>
              <div class="flex items-center gap-2 py-1.5 rounded hover:bg-muted/50 px-1 -mx-1 cursor-pointer transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-destructive shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h3"/></svg>
                <span class="text-xs truncate">Operations_Report_2022.pdf</span>
              </div>
              <ui-separator class="my-1"></ui-separator>
              <button class="text-xs text-primary hover:underline">Link existing document</button>
            </ui-card-content>
          </ui-card>

          <!-- Product Value Template card -->
          <ui-card class="border-0">
            <ui-card-header>
              <ui-card-title class="text-sm">Product Value Template</ui-card-title>
              <ui-card-description class="text-xs">Select how this product will appear in the on-site catalog view.</ui-card-description>
            </ui-card-header>
            <ui-card-content>
              <ui-radio-group value="high-tech" class="space-y-2">
                <div class="flex items-center gap-3 rounded-md border border-primary/50 bg-primary/5 p-3 cursor-pointer">
                  <ui-radio-group-item value="high-tech" id="vt-high"></ui-radio-group-item>
                  <div>
                    <label class="text-sm font-medium cursor-pointer" for="vt-high">High Tech Detailed</label>
                    <p class="text-xs text-muted-foreground">Full specs, documents, and diagrams</p>
                  </div>
                </div>
                <div class="flex items-center gap-3 rounded-md border border-border p-3 cursor-pointer hover:bg-muted/30 transition-colors">
                  <ui-radio-group-item value="standard" id="vt-std"></ui-radio-group-item>
                  <div>
                    <label class="text-sm font-medium cursor-pointer" for="vt-std">Standard Summary</label>
                    <p class="text-xs text-muted-foreground">Brief overview with key specs only</p>
                  </div>
                </div>
              </ui-radio-group>
            </ui-card-content>
          </ui-card>

        </div><!-- /right sidebar -->

      </div><!-- /2-col grid -->

    </main>

  </div><!-- /main column -->

</div>
    `,
  }),
};
