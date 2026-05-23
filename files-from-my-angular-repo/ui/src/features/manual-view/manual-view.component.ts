import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookOpen, ChevronUp, CirclePlay, FileText, Play, Printer } from 'lucide-angular';
import { IconComponent } from '../../components/icon';
import { IconPreviewComponent } from '../icon-preview';
import { DialogService } from '../../services';
import { LightboxService } from '../../components/lightbox/lightbox.service';
import type { LightboxItem } from '../../components/lightbox/lightbox.types';
import { VideoPlayerDialogComponent } from '../video-player-dialog/video-player-dialog.component';

@Component({
  selector: 'ui-manual-view',
  standalone: true,
  imports: [CommonModule, IconComponent, IconPreviewComponent],
  template: `
    @if (manual) {
      <!-- Manual Header Card -->
      <div class="bg-blue-50/50 border border-blue-100 rounded-lg p-8 mb-10">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ manual.name }}</h1>
            <div class="space-y-1 text-sm">
              @if (manual.abbr) {
                <div class="flex gap-3">
                  <span class="text-gray-400 uppercase text-xs font-semibold tracking-wide w-20 text-right">Model</span>
                  <span class="text-gray-800">{{ manual.abbr }}</span>
                </div>
              }
              @if (manual.machine) {
                <div class="flex gap-3">
                  <span class="text-gray-400 uppercase text-xs font-semibold tracking-wide w-20 text-right"
                    >Machine</span
                  >
                  <span class="text-gray-800">{{ manual.machine }}</span>
                </div>
              }
              @if (manual.version) {
                <div class="flex gap-3">
                  <span class="text-gray-400 uppercase text-xs font-semibold tracking-wide w-20 text-right"
                    >Version</span
                  >
                  <span class="text-gray-800">{{ manual.version }}</span>
                </div>
              }
              @if (manual.groupName) {
                <div class="flex gap-3">
                  <span class="text-gray-400 uppercase text-xs font-semibold tracking-wide w-20 text-right"
                    >Created</span
                  >
                  <span class="text-gray-800">{{ manual.groupName }}</span>
                </div>
              }
              @if (manual.lastChange) {
                <div class="flex gap-3">
                  <span class="text-gray-400 uppercase text-xs font-semibold tracking-wide w-20 text-right"
                    >Updated</span
                  >
                  <span class="text-gray-800">{{ formatDateTime(manual.lastChange) }}</span>
                </div>
              }
            </div>
          </div>
          <button
            class="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm text-gray-700"
            (click)="printManual()"
          >
            <ui-icon [name]="PrinterIcon" size="sm" />
            Print Manual
          </button>
        </div>
        @if (manual.desc) {
          <div class="text-gray-600 italic leading-relaxed mt-5" [innerHTML]="manual.desc"></div>
        }
      </div>

      <!-- Two-column layout: TOC + Content -->
      @if (manual.sections && manual.sections.length > 0) {
        <div class="flex gap-8 items-start">
          <!-- Table of Contents (sticky sidebar) -->
          <div class="hidden lg:block w-[340px] flex-shrink-0 sticky top-4">
            <div
              class="bg-gray-50 border border-gray-200 rounded-lg p-5 max-h-[calc(100vh-100px)] overflow-y-auto"
              style="scrollbar-width:thin"
            >
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Table of Contents</h3>
              @for (section of manual.sections; track section.id; let si = $index) {
                <div class="mb-4">
                  <a class="flex items-start gap-2 group cursor-pointer" (click)="scrollToSection(section.id)">
                    <span class="w-2 h-2 rounded-full bg-brand mt-1.5 flex-shrink-0"></span>
                    <span class="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors">
                      {{ section.name }}
                    </span>
                  </a>
                  @if (section.items && section.items.length > 0) {
                    <div class="ml-4 mt-1 space-y-0.5">
                      @for (item of section.items; track item.id; let ii = $index) {
                        <a
                          class="block text-sm text-brand hover:text-brand hover:underline cursor-pointer pl-2"
                          (click)="scrollToItem(section.id, item.id)"
                        >
                          {{ si + 1 }}.{{ ii + 1 }}. {{ item.name }}
                        </a>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            @for (section of manual.sections; track section.id; let si = $index) {
              <div [id]="'section-' + section.id" class="mb-12">
                <!-- Section Title -->
                <div class="flex items-center gap-3 mb-4">
                  <h2 class="text-2xl font-bold text-gray-900">{{ section.name }}</h2>
                  <button class="text-gray-300 hover:text-gray-500 transition-colors" (click)="scrollToTop()">
                    <ui-icon [name]="ChevronUpIcon" size="sm" />
                  </button>
                </div>

                @if (section.desc) {
                  <div class="text-gray-600 italic leading-relaxed mb-6" [innerHTML]="section.desc"></div>
                }

                <!-- Items -->
                @if (section.items && section.items.length > 0) {
                  <div class="space-y-3">
                    @for (item of section.items; track item.id) {
                      <div
                        [id]="'item-' + section.id + '-' + item.id"
                        class="flex gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
                      >
                        <!-- Icon -->
                        @if (item.icon && (item.icon.icon || item.icon.iconText)) {
                          <div class="flex-shrink-0 pt-0.5">
                            <ui-icon-preview
                              [icon]="item.icon.icon"
                              [iconText]="item.icon.iconText"
                              [color]="item.icon.color"
                              [shape]="item.icon.shape"
                              [shapeColor]="item.icon.shapeColor"
                              size="default"
                            />
                          </div>
                        }
                        <!-- Content -->
                        <div class="min-w-0 flex-1">
                          @if (item.name) {
                            <p class="text-[15px] font-medium text-gray-900">{{ item.name }}</p>
                          }
                          @if (item.header || item.desc) {
                            <p class="text-sm text-gray-600 mt-0.5 leading-relaxed">
                              @if (item.header) {
                                <span class="font-bold text-gray-800">{{ item.header }}</span>
                                @if (item.desc) {
                                  <span>&nbsp;&nbsp;</span>
                                }
                              }
                              @if (item.desc) {
                                <span
                                  class="[&_p]:inline [&_a]:text-brand [&_a]:underline [&_strong]:font-semibold"
                                  [innerHTML]="item.desc"
                                ></span>
                              }
                            </p>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }

                <!-- Images -->
                @if (section.images && section.images.length > 0) {
                  <div class="mt-6">
                    <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Images</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      @for (img of section.images; track img.id; let imgIdx = $index) {
                        <button
                          class="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer text-left"
                          (click)="openImageGallery(si, imgIdx)"
                        >
                          <img
                            [src]="img.url"
                            [alt]="img.name || 'Image'"
                            class="w-full h-32 object-contain bg-gray-50 p-2"
                          />
                          @if (img.name) {
                            <p class="text-xs text-brand p-2 truncate">{{ img.name }}</p>
                          }
                        </button>
                      }
                    </div>
                  </div>
                }

                <!-- Documents -->
                @if (section.documents && section.documents.length > 0) {
                  <div class="mt-6">
                    <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Documents</h3>
                    <div class="flex flex-wrap gap-3">
                      @for (doc of section.documents; track doc.id) {
                        <a
                          [href]="doc.url"
                          target="_blank"
                          rel="noopener"
                          class="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                        >
                          <ui-icon [name]="FileTextIcon" size="sm" class="text-red-500" />
                          {{ doc.name || 'Document' }}
                        </a>
                      }
                    </div>
                  </div>
                }

                <!-- Parts -->
                @if (section.parts && section.parts.length > 0) {
                  <div class="mt-6">
                    <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Parts</h3>
                    <div class="overflow-hidden border border-gray-200 rounded-lg">
                      <table class="w-full text-sm">
                        <thead>
                          <tr class="bg-gray-50">
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">Part Number</th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                            <th class="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (part of section.parts; track part.id; let odd = $odd) {
                            <tr [class]="odd ? 'bg-gray-50' : 'bg-white'">
                              <td class="px-4 py-2 font-mono text-gray-600">
                                {{ part.partNumber || '—' }}
                              </td>
                              <td class="px-4 py-2 text-gray-900">{{ part.name || '—' }}</td>
                              <td class="px-4 py-2 text-gray-500">{{ part.desc || '—' }}</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }

                <!-- Videos -->
                @if (section.videos && section.videos.length > 0) {
                  <div class="mt-6">
                    <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Videos</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      @for (vid of section.videos; track vid.id; let vidIdx = $index) {
                        <button
                          class="rounded-lg overflow-hidden border border-gray-200 bg-white text-left hover:shadow-card transition-shadow group cursor-pointer"
                          (click)="openVideoPlayer(si, vidIdx)"
                        >
                          @if (getYouTubeId(vid.pageUrl)) {
                            <div class="relative pt-[56.25%] bg-gray-900">
                              <img
                                [src]="'https://img.youtube.com/vi/' + getYouTubeId(vid.pageUrl) + '/mqdefault.jpg'"
                                [alt]="vid.name || 'Video'"
                                class="absolute inset-0 w-full h-full object-cover"
                              />
                              <div
                                class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
                              >
                                <div
                                  class="w-14 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-700 transition-colors"
                                >
                                  <ui-icon [name]="PlayIcon" [size]="28" class="text-white" />
                                </div>
                              </div>
                            </div>
                          } @else {
                            <div class="flex items-center gap-2 p-4">
                              <ui-icon [name]="CirclePlayIcon" size="sm" class="text-red-600" />
                            </div>
                          }
                          @if (vid.name) {
                            <div class="p-3">
                              <p class="text-sm font-medium text-gray-900">{{ vid.name }}</p>
                            </div>
                          }
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="text-center py-10 text-gray-400">
          <ui-icon [name]="BookOpenIcon" [size]="48" class="mb-2" />
          <p>This manual has no sections yet.</p>
        </div>
      }
    }
  `,
})
export class ManualViewComponent {
  @Input() manual: any;

  private dialogService = inject(DialogService);
  private lightboxService = inject(LightboxService);

  protected readonly PrinterIcon = Printer;
  protected readonly ChevronUpIcon = ChevronUp;
  protected readonly FileTextIcon = FileText;
  protected readonly PlayIcon = Play;
  protected readonly CirclePlayIcon = CirclePlay;
  protected readonly BookOpenIcon = BookOpen;

  scrollToSection(sectionId: string): void {
    document.getElementById('section-' + sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToItem(sectionId: string, itemId: string): void {
    document.getElementById('item-' + sectionId + '-' + itemId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  printManual(): void {
    window.print();
  }

  formatDateTime(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = d.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
            ? 'rd'
            : 'th';
    const hours = d.getHours();
    const mins = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${months[d.getMonth()]} ${day}${suffix} ${d.getFullYear().toString().slice(2)} ${h}:${mins}${ampm}`;
  }

  openImageGallery(sectionIndex: number, imageIndex: number): void {
    const section = this.manual?.sections?.[sectionIndex];
    if (!section?.images?.length) return;
    const imageUrls = section.images.map((img: any) => img.url).filter(Boolean) as string[];
    if (!imageUrls.length) return;
    const items: LightboxItem[] = imageUrls.map((url, i) => ({
      src: url,
      thumb: url,
      alt: `${section.name || this.manual?.name || 'Manual'} image ${i + 1}`,
    }));
    this.lightboxService.open(items, {
      startIndex: imageIndex,
      loop: true,
      showThumbs: true,
      thumbPosition: 'left',
      thumbType: 'classic',
      showCounter: true,
      openFrom: 'center',
      toolbarRight: ['zoom-in', 'zoom-out', 'fullscreen', 'close'],
    });
  }

  openVideoPlayer(sectionIndex: number, videoIndex: number): void {
    const section = this.manual?.sections?.[sectionIndex];
    if (!section?.videos?.length) return;
    const allVideos = section.videos.map((v: any) => ({
      id: v.id,
      title: v.name || '',
      youtubeId: this.getYouTubeId(v.pageUrl) || undefined,
      pageUrl: v.pageUrl,
    }));
    const currentVideo = allVideos[videoIndex] || allVideos[0];
    this.dialogService.open(VideoPlayerDialogComponent, {
      data: {
        video: currentVideo,
        videos: allVideos,
        currentIndex: videoIndex,
      },
      panelClass: 'w-[90vw] max-w-[900px]',
      autoFocus: false,
    });
  }

  getYouTubeId(url?: string): string | null {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    return null;
  }
}
