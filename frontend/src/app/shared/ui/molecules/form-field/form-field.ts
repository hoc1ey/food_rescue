import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="field-container">
      <div *ngIf="label" class="label-wrapper">
        <lucide-icon *ngIf="icon" [img]="icon" [size]="16" class="icon"></lucide-icon>
        <label class="label">{{ label }}</label>
      </div>
      
      <!-- Aquí se inyectará el input nativo -->
      <ng-content></ng-content>
      
      <span *ngIf="error" class="error-msg">{{ error }}</span>
    </div>
  `,
  styles: [`
    .field-container { display: flex; flex-direction: column; gap: var(--spacing-xs); margin-bottom: var(--spacing-md); }
    .label-wrapper { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
    .label { font-size: 0.875rem; font-weight: 500; }
    .icon { color: #666; }
    .error-msg { color: var(--color-error); font-size: 0.75rem; }
  `]
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() icon: any = null; // Recibe el objeto del icono de Lucide
  @Input() error: string | null = null;
}