import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="field-container">
      <label *ngIf="label" class="label">{{ label }}</label>
      
      <!-- Aquí se inyectará el input nativo -->
      <ng-content></ng-content>
      
      <span *ngIf="error" class="error-msg">{{ error }}</span>
    </div>
  `,
  styles: [`
    .field-container { display: flex; flex-direction: column; gap: var(--spacing-xs); margin-bottom: var(--spacing-md); }
    .label { font-size: 0.875rem; font-weight: 500; }
    .error-msg { color: var(--color-error); font-size: 0.75rem; }
  `]
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() error: string | null = null;
}