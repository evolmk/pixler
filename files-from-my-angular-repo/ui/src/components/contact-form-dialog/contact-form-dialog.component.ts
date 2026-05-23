import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
  type InputSignal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { InputComponent } from '../input/input.component';
import { LabelComponent } from '../label/label.directive';
import {
  DialogComponent,
  DialogContentComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogBodyComponent,
  DialogFooterComponent,
} from '../dialog/dialog.component';
import type { CompanyContactFormDto, ContactPublic } from '../../types/contact';

export type ContactFormMode = 'create' | 'edit';

// Shared `<ui-contact-form>` dialog. Encapsulates the dialog shell. Emits
// `submit(CompanyContactFormDto)` on Save. Pure — does not call any API.
@Component({
  selector: 'ui-contact-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonComponent,
    CheckboxComponent,
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogBodyComponent,
    DialogFooterComponent,
    InputComponent,
    LabelComponent,
  ],
  template: `
    <ui-dialog #dialog size="md">
      <ui-dialog-content>
        <ui-dialog-header>
          <ui-dialog-title>
            {{ mode() === 'edit' ? 'Edit contact' : 'Add new contact' }}
          </ui-dialog-title>
        </ui-dialog-header>
        <ui-dialog-body>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label uiLabel [required]="true">First Name</label>
              <input
                uiInput
                [value]="firstName()"
                (input)="firstName.set($any($event.target).value)"
                placeholder="First name"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label uiLabel [required]="true">Last Name</label>
              <input
                uiInput
                [value]="lastName()"
                (input)="lastName.set($any($event.target).value)"
                placeholder="Last name"
              />
            </div>
            <div class="flex flex-col gap-1 sm:col-span-2">
              <label uiLabel [required]="true">Email</label>
              <input
                uiInput
                type="email"
                [value]="email()"
                (input)="email.set($any($event.target).value)"
                placeholder="you@company.com"
              />
              @if (email() && !emailValid()) {
                <span class="text-xs text-destructive">Please enter a valid email.</span>
              }
            </div>
            <div class="flex flex-col gap-1">
              <label uiLabel>Phone</label>
              <input
                uiInput
                type="tel"
                [value]="phoneMain()"
                (input)="phoneMain.set($any($event.target).value)"
                placeholder="(555) 555-0100"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label uiLabel>Extension</label>
              <input
                uiInput
                [value]="phoneExt()"
                (input)="phoneExt.set($any($event.target).value)"
                placeholder="ext."
              />
            </div>
            <div class="flex flex-col gap-1">
              <label uiLabel>Mobile</label>
              <input
                uiInput
                type="tel"
                [value]="phoneMobile()"
                (input)="phoneMobile.set($any($event.target).value)"
                placeholder="(555) 555-0100"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label uiLabel>Job Title</label>
              <input
                uiInput
                [value]="jobTitle()"
                (input)="jobTitle.set($any($event.target).value)"
                placeholder="Job title"
              />
            </div>
            <div class="flex flex-col gap-1 sm:col-span-2">
              <label uiLabel>Company</label>
              <input
                uiInput
                [value]="companyName()"
                (input)="companyName.set($any($event.target).value)"
                placeholder="Company name"
              />
            </div>
            <label class="flex items-center gap-2 sm:col-span-2 cursor-pointer text-sm text-foreground">
              <ui-checkbox [checked]="mailingList()" (checkedChange)="mailingList.set($event)" />
              Subscribe to mailing list
            </label>
            <label class="flex items-center gap-2 sm:col-span-2 cursor-pointer text-sm text-foreground">
              <ui-checkbox [checked]="setPrimary()" (checkedChange)="setPrimary.set($event)" />
              Set as primary contact
            </label>
          </div>
        </ui-dialog-body>
        <ui-dialog-footer>
          <button uiButton variant="outline" (click)="close()">Cancel</button>
          <button uiButton variant="default" [disabled]="!formValid()" (click)="onSubmit()">
            {{ mode() === 'edit' ? 'Save Changes' : 'Save Contact' }}
          </button>
        </ui-dialog-footer>
      </ui-dialog-content>
    </ui-dialog>
  `,
})
export class ContactFormDialogComponent {
  // Inputs ────────────────────────────────────────────────────────────────
  readonly mode: InputSignal<ContactFormMode> = input<ContactFormMode>('create');
  readonly contact: InputSignal<ContactPublic | null | undefined> = input<ContactPublic | null | undefined>(undefined);
  readonly initialSetPrimary: InputSignal<boolean> = input<boolean>(false);

  // Output ────────────────────────────────────────────────────────────────
  readonly submitForm = output<CompanyContactFormDto>();

  // Form state (signal-based, no Reactive Forms — matches codebase convention)
  protected readonly firstName = signal('');
  protected readonly lastName = signal('');
  protected readonly email = signal('');
  protected readonly phoneMain = signal('');
  protected readonly phoneExt = signal('');
  protected readonly phoneMobile = signal('');
  protected readonly jobTitle = signal('');
  protected readonly companyName = signal('');
  protected readonly mailingList = signal(false);
  protected readonly setPrimary = signal(false);

  protected readonly emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()));
  protected readonly formValid = computed(
    () => !!this.firstName().trim() && !!this.lastName().trim() && this.emailValid(),
  );

  protected readonly dialogRef = viewChild<DialogComponent>('dialog');

  constructor() {
    // Re-hydrate form fields whenever the `contact` input changes (edit mode)
    // or the dialog is reopened. For create mode the parent sets contact=null
    // and we reset to a blank form.
    effect(() => {
      const c = this.contact();
      this.firstName.set(c?.firstName ?? '');
      this.lastName.set(c?.lastName ?? '');
      this.email.set(c?.email ?? '');
      this.phoneMain.set(c?.phoneMain ?? '');
      this.phoneExt.set(c?.phoneExt ?? '');
      this.phoneMobile.set(c?.phoneMobile ?? '');
      this.jobTitle.set(c?.jobTitle ?? '');
      this.companyName.set(c?.companyName ?? '');
      this.mailingList.set(!!c?.mailingList);
      this.setPrimary.set(this.initialSetPrimary());
    });
  }

  open(): void {
    this.dialogRef()?.open();
  }

  close(): void {
    this.dialogRef()?.close();
  }

  protected onSubmit(): void {
    if (!this.formValid()) return;
    const dto: CompanyContactFormDto = {
      firstName: this.firstName().trim(),
      lastName: this.lastName().trim(),
      email: this.email().trim(),
      phoneMain: this.phoneMain().trim() || undefined,
      phoneExt: this.phoneExt().trim() || undefined,
      phoneMobile: this.phoneMobile().trim() || undefined,
      jobTitle: this.jobTitle().trim() || undefined,
      companyName: this.companyName().trim() || undefined,
      mailingList: this.mailingList(),
      setPrimary: this.setPrimary(),
    };
    this.submitForm.emit(dto);
  }
}
