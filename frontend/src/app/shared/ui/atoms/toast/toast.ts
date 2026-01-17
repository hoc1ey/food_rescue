import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '../../../lucide-icons.module';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, LucideIconsModule],
    template: `
    <div class="toast" [class]="'toast-' + type" [@slideIn]>
      <div class="toast-icon">
        <lucide-icon [name]="getIcon()" class="icon"></lucide-icon>
      </div>
      <div class="toast-content">
        <p class="toast-title" *ngIf="title">{{ title }}</p>
        <p class="toast-message">{{ message }}</p>
      </div>
      <button class="toast-close" (click)="onClose()">
        <lucide-icon name="x" class="close-icon"></lucide-icon>
      </button>
    </div>
  `,
    styles: [`
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 320px;
      max-width: 420px;
      border-left: 4px solid;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-success {
      border-left-color: #10b981;
    }

    .toast-info {
      border-left-color: #3b82f6;
    }

    .toast-warning {
      border-left-color: #f59e0b;
    }

    .toast-error {
      border-left-color: #ef4444;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-success .icon {
      color: #10b981;
    }

    .toast-info .icon {
      color: #3b82f6;
    }

    .toast-warning .icon {
      color: #f59e0b;
    }

    .toast-error .icon {
      color: #ef4444;
    }

    .toast-content {
      flex: 1;
    }

    .toast-title {
      font-weight: 600;
      font-size: 14px;
      margin: 0 0 4px 0;
      color: #1f2937;
    }

    .toast-message {
      font-size: 14px;
      margin: 0;
      color: #6b7280;
      line-height: 1.4;
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      transition: color 0.2s;
    }

    .toast-close:hover {
      color: #4b5563;
    }

    .close-icon {
      width: 16px;
      height: 16px;
    }
  `]
})
export class ToastComponent implements OnInit {
    @Input() type: ToastType = 'info';
    @Input() title?: string;
    @Input() message: string = '';
    @Input() duration: number = 5000;
    @Output() close = new EventEmitter<void>();

    ngOnInit(): void {
        if (this.duration > 0) {
            setTimeout(() => {
                this.onClose();
            }, this.duration);
        }
    }

    getIcon(): string {
        switch (this.type) {
            case 'success':
                return 'check-circle';
            case 'info':
                return 'info';
            case 'warning':
                return 'alert-triangle';
            case 'error':
                return 'alert-circle';
            default:
                return 'bell';
        }
    }

    onClose(): void {
        this.close.emit();
    }
}
