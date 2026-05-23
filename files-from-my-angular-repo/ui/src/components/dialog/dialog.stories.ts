// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
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
  DialogActionDirective,
  DialogCancelDirective,
} from './dialog.component';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { LabelComponent } from '../label/label.directive';

const DIALOG_PARTS = [
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
];

const meta: Meta<DialogComponent> = {
  title: 'Overlay/Dialog',
  component: DialogComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { height: '500px' } },
  },
};
export default meta;
type Story = StoryObj<DialogComponent>;

// ── All Variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => ({
    moduleMetadata: { imports: [...DIALOG_PARTS, ButtonComponent] },
    template: `
      <div class="flex flex-col gap-6 p-6">

        <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sizes: xxs · xs · sm · md · default · lg · xl · xxl · full</p>
        <div class="flex flex-wrap gap-3">
          <ui-dialog size="xxs">
            <ui-button uiDialogTrigger variant="outline" size="sm">xxs</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>XXS Dialog</ui-dialog-title>
                <ui-dialog-description>max-w-2xs — tiny confirmation prompts.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">Minimal content area.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" size="sm" uiDialogClose>Cancel</ui-button>
                <ui-button size="sm" uiDialogClose>OK</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>

          <ui-dialog size="xs">
            <ui-button uiDialogTrigger variant="outline" size="sm">xs</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>XS Dialog</ui-dialog-title>
                <ui-dialog-description>max-w-xs — compact prompts &amp; quick actions.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">Extra-small dialog content.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" size="sm" uiDialogClose>Cancel</ui-button>
                <ui-button size="sm" uiDialogClose>Confirm</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>

          <ui-dialog size="sm">
            <ui-button uiDialogTrigger variant="outline" size="sm">sm</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>Small Dialog</ui-dialog-title>
                <ui-dialog-description>max-w-md — simple forms &amp; confirmations.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">Small dialog content.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
                <ui-button uiDialogClose>Update</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>

          <ui-dialog size="md">
            <ui-button uiDialogTrigger variant="outline" size="sm">md</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>Medium Dialog</ui-dialog-title>
                <ui-dialog-description>max-w-lg — standard forms &amp; detail views.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">Medium dialog content.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
                <ui-button uiDialogClose>Save</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>

          <ui-dialog>
            <ui-button uiDialogTrigger variant="outline" size="sm">default</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>Default Dialog</ui-dialog-title>
                <ui-dialog-description>max-w-xl — the standard dialog size.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">Default dialog content.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
                <ui-button uiDialogClose>Update</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>

          <ui-dialog size="lg">
            <ui-button uiDialogTrigger variant="outline" size="sm">lg</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>Large Dialog</ui-dialog-title>
                <ui-dialog-description>max-w-2xl — multi-column forms &amp; data views.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">Large dialog content.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
                <ui-button uiDialogClose>Update</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>

          <ui-dialog size="xl">
            <ui-button uiDialogTrigger variant="outline" size="sm">xl</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>Extra Large Dialog</ui-dialog-title>
                <ui-dialog-description>max-w-3xl — complex layouts &amp; tables.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">Extra large dialog content.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
                <ui-button uiDialogClose>Update</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>

          <ui-dialog size="xxl">
            <ui-button uiDialogTrigger variant="outline" size="sm">xxl</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>XXL Dialog</ui-dialog-title>
                <ui-dialog-description>max-w-5xl — dashboards &amp; wide content.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">XXL dialog content with room for wide layouts.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
                <ui-button uiDialogClose>Update</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>

          <ui-dialog size="full">
            <ui-button uiDialogTrigger variant="outline" size="sm">full</ui-button>
            <ui-dialog-content>
              <ui-dialog-header>
                <ui-dialog-title>Fullscreen Dialog</ui-dialog-title>
                <ui-dialog-description>Takes up the entire viewport for immersive workflows.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-body><p class="text-sm text-muted-foreground">Fullscreen dialog content.</p></ui-dialog-body>
              <ui-dialog-footer>
                <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
                <ui-button uiDialogClose>Update</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>
        </div>

        <div>
          <p class="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Mode: alert</p>
          <ui-dialog>
            <ui-button uiDialogTrigger variant="destructive" size="sm">Open Alert Mode</ui-button>
            <ui-dialog-content mode="alert">
              <ui-dialog-header>
                <ui-dialog-title>Are you sure?</ui-dialog-title>
                <ui-dialog-description>This action cannot be undone.</ui-dialog-description>
              </ui-dialog-header>
              <ui-dialog-footer>
                <ui-button variant="outline" uiDialogCancel>Cancel</ui-button>
                <ui-button variant="destructive" uiDialogAction>Delete</ui-button>
              </ui-dialog-footer>
            </ui-dialog-content>
          </ui-dialog>
        </div>
      </div>
    `,
  }),
};

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [...DIALOG_PARTS, ButtonComponent] },
    template: `
      <ui-dialog>
        <ui-button uiDialogTrigger>Open Dialog</ui-button>
        <ui-dialog-content>
          <ui-dialog-header>
            <ui-dialog-title>Dialog Title</ui-dialog-title>
            <ui-dialog-description>This is a description of the dialog content.</ui-dialog-description>
          </ui-dialog-header>
          <ui-dialog-body>
            <p class="text-sm text-muted-foreground">Add your content here. The dialog can contain any content.</p>
          </ui-dialog-body>
          <ui-dialog-footer>
            <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
            <ui-button uiDialogClose>Update</ui-button>
          </ui-dialog-footer>
        </ui-dialog-content>
      </ui-dialog>
    `,
  }),
};

// ── With Form ─────────────────────────────────────────────────────────────────

export const WithForm: Story = {
  render: () => ({
    moduleMetadata: { imports: [...DIALOG_PARTS, ButtonComponent, InputComponent, LabelComponent] },
    template: `
      <ui-dialog>
        <ui-button uiDialogTrigger variant="outline">Edit Profile</ui-button>
        <ui-dialog-content>
          <ui-dialog-header>
            <ui-dialog-title>Edit Profile</ui-dialog-title>
            <ui-dialog-description>Make changes to your profile here.</ui-dialog-description>
          </ui-dialog-header>
          <ui-dialog-body class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label uiLabel for="dlg-name">Name</label>
              <input uiInput id="dlg-name" value="John Doe" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label uiLabel for="dlg-email">Email</label>
              <input uiInput id="dlg-email" type="email" value="john@example.com" />
            </div>
          </ui-dialog-body>
          <ui-dialog-footer>
            <ui-button variant="outline" uiDialogClose>Cancel</ui-button>
            <ui-button uiDialogClose>Update</ui-button>
          </ui-dialog-footer>
        </ui-dialog-content>
      </ui-dialog>
    `,
  }),
};

// ── Alert Mode ───────────────────────────────────────────────────────────────

export const AlertMode: Story = {
  render: () => ({
    moduleMetadata: { imports: [...DIALOG_PARTS, ButtonComponent] },
    template: `
      <ui-dialog>
        <ui-button variant="destructive" uiDialogTrigger>Delete Order</ui-button>
        <ui-dialog-content mode="alert">
          <ui-dialog-header>
            <ui-dialog-title>Are you absolutely sure?</ui-dialog-title>
            <ui-dialog-description>
              This action cannot be undone. This will permanently delete the order and all associated data.
            </ui-dialog-description>
          </ui-dialog-header>
          <ui-dialog-footer>
            <ui-button variant="outline" uiDialogCancel>Cancel</ui-button>
            <ui-button variant="destructive" uiDialogAction>Delete</ui-button>
          </ui-dialog-footer>
        </ui-dialog-content>
      </ui-dialog>
    `,
  }),
};
