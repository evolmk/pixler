import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
  signal,
  viewChild,
  type InputSignal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import {
  DIALOG_TOKEN,
  DialogComponent,
  DialogContentComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
  DialogBodyComponent,
  DialogFooterComponent,
} from '../dialog/dialog.component';
import { IconComponent } from '../icon/icon.component';
import { Check, Pencil, Plus, Star } from 'lucide-angular';
import type { ContactPublic } from '../../types/contact';

// Shared `<ui-contact-picker>` dialog. Encapsulates the dialog shell so
// consumers only need `<ui-contact-picker #picker ... />` + `picker.open()`
// to drive it; closes itself on Cancel + selection.
//
// The component is **pure** — it does not call any API. The parent supplies
// `availableContacts` and reacts to `selected` / `editRequested` / `addRequested`.
@Component({
  selector: 'ui-contact-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonComponent,
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogBodyComponent,
    DialogFooterComponent,
    IconComponent,
  ],
  template: `
    <ui-dialog #dialog size="md">
      <ui-dialog-content>
        <ui-dialog-header>
          <ui-dialog-title>Select a contact</ui-dialog-title>
        </ui-dialog-header>
        <ui-dialog-body>
          <div class="flex flex-col gap-2">
            @for (contact of availableContacts(); track contact.id) {
              <button
                type="button"
                class="group relative flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                [class.border-primary]="selectedId() === contact.id"
                [class.bg-accent]="selectedId() === contact.id"
                (click)="selectedId.set(contact.id)"
              >
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-brand"
                >
                  {{ initials(contact) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-foreground truncate">
                      {{ fullName(contact) }}
                    </span>
                    @if (primaryId() === contact.id) {
                      <span
                        class="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand"
                      >
                        <ui-icon [name]="icons.Star" [size]="10" />
                        Primary
                      </span>
                    }
                  </div>
                  @if (contact.jobTitle || contact.companyName) {
                    <div class="text-xs text-muted-foreground truncate">
                      @if (contact.jobTitle) {
                        <span>{{ contact.jobTitle }}</span>
                      }
                      @if (contact.jobTitle && contact.companyName) {
                        <span aria-hidden="true"> — </span>
                      }
                      @if (contact.companyName) {
                        <span>{{ contact.companyName }}</span>
                      }
                    </div>
                  }
                  <div class="mt-1 text-xs text-muted-foreground truncate">
                    @if (contact.email) {
                      <span>{{ contact.email }}</span>
                    }
                    @if (contact.email && contact.phoneMain) {
                      <span aria-hidden="true"> • </span>
                    }
                    @if (contact.phoneMain) {
                      <span>{{ contact.phoneMain }}</span>
                    }
                  </div>
                </div>
                @if (selectedId() === contact.id) {
                  <ui-icon [name]="icons.Check" [size]="18" class="text-brand mt-0.5" />
                }
                <button
                  type="button"
                  uiButton
                  variant="ghost"
                  size="icon"
                  class="absolute top-1 right-1 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Edit contact"
                  (click)="onEditClick($event, contact)"
                >
                  <ui-icon [name]="icons.Pencil" [size]="14" />
                </button>
              </button>
            }

            @if (showAddNew()) {
              <button
                type="button"
                class="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-transparent px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-brand hover:bg-accent hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                (click)="onAddClick()"
              >
                <ui-icon [name]="icons.Plus" [size]="16" />
                Add new contact
              </button>
            }
          </div>
        </ui-dialog-body>
        <ui-dialog-footer>
          <button uiButton variant="outline" (click)="close()">Cancel</button>
          <button uiButton variant="default" [disabled]="!selectedId()" (click)="onConfirm()">Use this contact</button>
        </ui-dialog-footer>
      </ui-dialog-content>
    </ui-dialog>
  `,
})
export class ContactPickerDialogComponent {
  // Inputs ────────────────────────────────────────────────────────────────
  readonly availableContacts: InputSignal<ContactPublic[]> = input.required<ContactPublic[]>();
  readonly initialSelectedId: InputSignal<string | null | undefined> = input<string | null | undefined>(undefined);
  readonly primaryId: InputSignal<string | null | undefined> = input<string | null | undefined>(undefined);
  readonly showAddNew: InputSignal<boolean> = input<boolean>(true);

  // Outputs ───────────────────────────────────────────────────────────────
  readonly selected = output<ContactPublic>();
  readonly editRequested = output<ContactPublic>();
  readonly addRequested = output<void>();

  protected readonly icons = { Check, Pencil, Plus, Star };
  protected readonly selectedId = signal<string | null>(null);
  protected readonly dialogRef = viewChild<DialogComponent>('dialog');

  // Public API to drive the dialog from a parent.
  open(): void {
    // Re-sync selection with the latest initialSelectedId each time the
    // picker is opened so the parent can advance the pre-selection between
    // opens (e.g. after saving a new contact via the form dialog).
    const initial = this.initialSelectedId();
    this.selectedId.set(initial ?? null);
    this.dialogRef()?.open();
  }

  close(): void {
    this.dialogRef()?.close();
  }

  protected onConfirm(): void {
    const id = this.selectedId();
    if (!id) return;
    const match = this.availableContacts().find((c) => c.id === id);
    if (!match) return;
    this.selected.emit(match);
    this.close();
  }

  protected onAddClick(): void {
    this.addRequested.emit();
  }

  protected onEditClick(ev: Event, contact: ContactPublic): void {
    ev.stopPropagation();
    this.editRequested.emit(contact);
  }

  protected initials(c: ContactPublic): string {
    const a = (c.firstName ?? '').trim();
    const b = (c.lastName ?? '').trim();
    return `${a.charAt(0)}${b.charAt(0)}`.toUpperCase() || '?';
  }

  protected fullName(c: ContactPublic): string {
    return [c.firstName, c.lastName].filter(Boolean).join(' ') || c.email || 'Contact';
  }
}
