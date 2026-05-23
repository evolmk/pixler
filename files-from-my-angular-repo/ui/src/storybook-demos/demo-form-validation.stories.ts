// @ts-nocheck
/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, StoryObj } from '@storybook/angular';

import { ButtonComponent } from '../components/button/button.component';
import { InputComponent } from '../components/input/input.component';
import { TextareaComponent } from '../components/textarea/textarea.component';
import { InputNumberComponent } from '../components/input-number/input-number.component';
import { CheckboxComponent } from '../components/checkbox/checkbox.component';
import {
  SelectComponent,
  SelectTriggerComponent,
  SelectValueComponent,
  SelectContentComponent,
  SelectItemComponent,
} from '../components/select/select.component';
import { LabelComponent } from '../components/label/label.directive';
import {
  FormFieldComponent,
  FormControlComponent,
  FormMessageComponent,
} from '../components/form-field/form-field.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
} from '../components/card/card.component';
import { SeparatorComponent } from '../components/separator/separator.component';
import { BadgeComponent } from '../components/badge/badge.component';
import { AlertComponent, AlertTitleComponent, AlertDescriptionComponent } from '../components/alert/alert.component';

// ── Inline form component ────────────────────────────────────────────────────

@Component({
  selector: 'demo-form-validation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    InputNumberComponent,
    CheckboxComponent,
    SelectComponent,
    SelectTriggerComponent,
    SelectValueComponent,
    SelectContentComponent,
    SelectItemComponent,
    FormFieldComponent,
    LabelComponent,
    FormControlComponent,
    FormMessageComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    SeparatorComponent,
    BadgeComponent,
    AlertComponent,
    AlertTitleComponent,
    AlertDescriptionComponent,
  ],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-background">
      <ui-card>
        <ui-card-header>
          <ui-card-title>Contact Request</ui-card-title>
          <ui-card-description
            >Fill out the form below. All required fields must be completed before submitting.</ui-card-description
          >
        </ui-card-header>

        <ui-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Name -->
            <ui-form-field>
              <label uiLabel [required]="true" for="fv-name">Full Name</label>
              <ui-form-control
                [errorMessage]="showError('name') ? getError('name') : ''"
                helpText="Your first and last name."
              >
                <input
                  uiInput
                  id="fv-name"
                  formControlName="name"
                  placeholder="John Doe"
                  [status]="showError('name') ? 'error' : 'default'"
                />
              </ui-form-control>
            </ui-form-field>

            <!-- Email -->
            <ui-form-field>
              <label uiLabel [required]="true" for="fv-email">Email</label>
              <ui-form-control
                [errorMessage]="showError('email') ? getError('email') : ''"
                helpText="We'll never share your email."
              >
                <input
                  uiInput
                  id="fv-email"
                  type="email"
                  formControlName="email"
                  placeholder="you@example.com"
                  [status]="showError('email') ? 'error' : 'default'"
                />
              </ui-form-control>
            </ui-form-field>

            <!-- Department -->
            <ui-form-field>
              <label uiLabel [required]="true">Department</label>
              <ui-form-control [errorMessage]="showError('department') ? 'Please select a department.' : ''">
                <ui-select formControlName="department">
                  <ui-select-trigger>
                    <ui-select-value placeholder="Select department…" />
                  </ui-select-trigger>
                  <ui-select-content>
                    <ui-select-item value="sales">Sales</ui-select-item>
                    <ui-select-item value="support">Technical Support</ui-select-item>
                    <ui-select-item value="engineering">Engineering</ui-select-item>
                    <ui-select-item value="other">Other</ui-select-item>
                  </ui-select-content>
                </ui-select>
              </ui-form-control>
            </ui-form-field>

            <!-- Quantity -->
            <ui-form-field>
              <label uiLabel for="fv-qty">Quantity</label>
              <ui-form-control helpText="Number of units (1–999).">
                <ui-input-number formControlName="quantity" [min]="1" [max]="999" placeholder="Qty" class="w-32" />
              </ui-form-control>
            </ui-form-field>

            <!-- Message -->
            <ui-form-field>
              <label uiLabel [required]="true" for="fv-msg">Message</label>
              <ui-form-control
                [errorMessage]="showError('message') ? getError('message') : ''"
                helpText="Minimum 10 characters."
              >
                <textarea
                  uiTextarea
                  id="fv-msg"
                  formControlName="message"
                  placeholder="Describe your request…"
                  [rows]="4"
                  [status]="showError('message') ? 'error' : 'default'"
                ></textarea>
              </ui-form-control>
            </ui-form-field>

            <!-- Terms checkbox -->
            <div class="flex items-start gap-2">
              <ui-checkbox formControlName="terms" id="fv-terms" />
              <label for="fv-terms" class="text-sm cursor-pointer leading-5">
                I agree to the <a href="#" class="text-primary underline">terms and conditions</a>
              </label>
            </div>
            @if (showError('terms')) {
              <p class="text-xs text-destructive -mt-2">You must accept the terms to continue.</p>
            }

            <ui-separator />

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <button ui-button type="submit">Submit</button>
              <button ui-button type="button" variant="outline" (click)="onReset()">Reset</button>
              @if (submitted()) {
                <ui-badge variant="success" class="ml-auto">Submitted</ui-badge>
              }
            </div>
          </form>
        </ui-card-content>
      </ui-card>

      <!-- Result display -->
      @if (submitted()) {
        <ui-alert variant="success" class="mt-6">
          <ui-alert-title>Form Submitted Successfully</ui-alert-title>
          <ui-alert-description>
            <pre class="mt-2 text-xs font-mono whitespace-pre-wrap">{{ resultJson() }}</pre>
          </ui-alert-description>
        </ui-alert>
      }
    </div>
  `,
})
class DemoFormValidationComponent {
  private fb = new FormBuilder();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required],
    quantity: [1],
    message: ['', [Validators.required, Validators.minLength(10)]],
    terms: [false, Validators.requiredTrue],
  });

  submitted = signal(false);
  resultJson = signal('');

  showError = (field: string): boolean => {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && (ctrl?.dirty || ctrl?.touched));
  };

  getError = (field: string): string => {
    const ctrl = this.form.get(field);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required']) return `${this._fieldLabel(field)} is required.`;
    if (ctrl.errors['email']) return 'Please enter a valid email address.';
    if (ctrl.errors['minlength']) {
      const min = ctrl.errors['minlength'].requiredLength;
      return `Must be at least ${min} characters.`;
    }
    return 'Invalid value.';
  };

  private _fieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: 'Full name',
      email: 'Email',
      department: 'Department',
      message: 'Message',
      terms: 'Terms',
    };
    return labels[field] ?? field;
  }

  onSubmit = () => {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitted.set(true);
      this.resultJson.set(JSON.stringify(this.form.value, null, 2));
    }
  };

  onReset = () => {
    this.form.reset({ name: '', email: '', department: '', quantity: 1, message: '', terms: false });
    this.submitted.set(false);
    this.resultJson.set('');
  };
}

// ── Storybook meta ───────────────────────────────────────────────────────────

const meta: Meta<DemoFormValidationComponent> = {
  title: 'Demos/Form - Validation',
  component: DemoFormValidationComponent,
  tags: ['!autodocs'],
};
export default meta;
type Story = StoryObj<DemoFormValidationComponent>;

export const Default: Story = {
  name: 'Form - Validation',
};
