// @ts-nocheck
import { Meta, StoryObj } from '@storybook/angular';
import { FormFieldComponent, FormControlComponent, FormMessageComponent } from './form-field.component';
import { LabelComponent } from '../label/label.directive';
import { InputComponent } from '../input/input.component';
import { TextareaComponent } from '../textarea/textarea.component';

const ALL = [
  FormFieldComponent,
  LabelComponent,
  FormControlComponent,
  FormMessageComponent,
  InputComponent,
  TextareaComponent,
];

const meta: Meta<FormFieldComponent> = {
  title: 'Forms/FormField',
  component: FormFieldComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<FormFieldComponent>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-form-field class="w-72">
        <label uiLabel for="email">Email address</label>
        <ui-form-control helpText="We will never share your email.">
          <input uiInput id="email" type="email" placeholder="you@example.com" />
        </ui-form-control>
      </ui-form-field>
    `,
  }),
};

// ── Required ──────────────────────────────────────────────────────────────────

export const Required: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-form-field class="w-72">
        <label uiLabel [required]="true" for="username">Username</label>
        <ui-form-control>
          <input uiInput id="username" placeholder="john_doe" />
        </ui-form-control>
      </ui-form-field>
    `,
  }),
};

// ── With Error ────────────────────────────────────────────────────────────────

export const WithError: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-form-field class="w-72">
        <label uiLabel for="email-err">Email address</label>
        <ui-form-control errorMessage="Please enter a valid email address.">
          <input uiInput id="email-err" status="error" value="not-valid" />
        </ui-form-control>
        <ui-form-message type="error">Please enter a valid email address.</ui-form-message>
      </ui-form-field>
    `,
  }),
};

// ── With Help Text ────────────────────────────────────────────────────────────

export const WithHelp: Story = {
  render: () => ({
    moduleMetadata: { imports: ALL },
    template: `
      <ui-form-field class="w-72">
        <label uiLabel for="bio">Bio</label>
        <ui-form-control helpText="Max 160 characters.">
          <textarea uiTextarea id="bio" placeholder="Tell us about yourself…" rows="3"></textarea>
        </ui-form-control>
        <ui-form-message type="default">Max 160 characters.</ui-form-message>
      </ui-form-field>
    `,
  }),
};
