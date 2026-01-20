import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '../../../lucide-icons.module';  // ← solo esto

export type ToastType = 'success' | 'info' | 'warning' | 'error';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],  // ← solo esto
  template: `
    <div class="toast" [class]="'toast-' + type">
      <div class="toast-icon">
        <lucide-icon [img]="getIcon()" class="icon"></lucide-icon>
      </div>
      <div class="toast-content">
        <p class="toast-title" *ngIf="title">{{ title }}</p>
        <p class="toast-message">{{ message }}</p>
      </div>
      <button class="toast-close" (click)="onClose()">
        <!-- CAMBIA A name="x" minúscula -->
        <lucide-icon name="x" class="close-icon"></lucide-icon>
      </button>
    </div>
  `,
  styleUrl: './toast.css'
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

  getIcon(): any {
    // Simplificado: ya no necesitas importarlos, LucideIconsModule los tiene todos
    switch (this.type) {
      case 'success': return 'check-circle';
      case 'info': return 'info';
      case 'warning': return 'alert-triangle';
      case 'error': return 'alert-circle';
      default: return 'bell';
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
