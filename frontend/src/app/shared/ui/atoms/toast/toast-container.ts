import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent, ToastType } from './toast';

export interface Toast {
    id: number;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule, ToastComponent],
    template: `
    <div class="toast-container">
      <app-toast
        *ngFor="let toast of toasts"
        [type]="toast.type"
        [title]="toast.title"
        [message]="toast.message"
        [duration]="toast.duration || 5000"
        (close)="removeToast(toast.id)">
      </app-toast>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast-container > * {
      pointer-events: all;
    }

    @media (max-width: 640px) {
      .toast-container {
        top: 70px;
        right: 16px;
        left: 16px;
      }
    }
  `]
})
export class ToastContainerComponent {
    toasts: Toast[] = [];
    private nextId = 0;

    addToast(toast: Omit<Toast, 'id'>): void {
        const newToast: Toast = {
            ...toast,
            id: this.nextId++
        };
        this.toasts.push(newToast);
    }

    removeToast(id: number): void {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }

    clear(): void {
        this.toasts = [];
    }
}
