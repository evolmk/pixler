// @ts-nocheck
import { Component, inject, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Meta, StoryObj } from '@storybook/angular';
import { PdfViewerComponent } from './pdf-viewer.component';

/**
 * PdfViewer component — inline PDF document viewer modal.
 *
 * Opens a full-screen dialog with an embedded `<iframe>` for the PDF. Provide
 * `url` as a `SafeResourceUrl` (use `DomSanitizer.bypassSecurityTrustResourceUrl`)
 * and `rawUrl` as a plain string for the Open/Download buttons. Two-way bind
 * `[(open)]`. Emits `closed` on dismiss.
 *
 * Note: This story uses a `PdfStoryWrapperComponent` to inject `DomSanitizer`
 * and convert the plain string URL into a `SafeResourceUrl` before passing it
 * to `PdfViewerComponent`, avoiding the NG0904 unsafe resource URL error.
 */
@Component({
  selector: 'pdf-story-wrapper',
  standalone: true,
  imports: [PdfViewerComponent],
  template: `
    <p class="text-sm text-muted-foreground mb-3">
      PDF Viewer opens as a fullscreen modal (toggle "open" in controls).
    </p>
    <ui-pdf-viewer [open]="open" [url]="safeUrl" [rawUrl]="rawUrl" [title]="title" />
  `,
})
class PdfStoryWrapperComponent {
  private sanitizer = inject(DomSanitizer);
  @Input() open = true;
  @Input() rawUrl = '';
  @Input() title = '';
  safeUrl: SafeResourceUrl = '';

  @Input() set url(value: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(value || '');
  }
}

const meta: Meta<PdfStoryWrapperComponent> = {
  title: 'Features/PdfViewer',
  component: PdfStoryWrapperComponent,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the PDF viewer dialog is open',
      table: { defaultValue: { summary: 'false' } },
    },
    title: {
      control: 'text',
      description: 'Document title shown in the header',
    },
  },
  args: { open: true, title: 'Servo Capper 500 — Technical Manual' },
};

export default meta;
type Story = StoryObj<PdfStoryWrapperComponent>;

export const Default: Story = {
  render: (args) => ({
    moduleMetadata: { imports: [PdfStoryWrapperComponent] },
    props: {
      ...args,
      url: 'https://www.w3.org/WAI/WCAG21/wcag21.pdf',
      rawUrl: 'https://www.w3.org/WAI/WCAG21/wcag21.pdf',
    },
    template: `<pdf-story-wrapper [open]="open" [url]="url" [rawUrl]="rawUrl" [title]="title" />`,
  }),
};
