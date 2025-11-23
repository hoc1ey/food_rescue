import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type" 
      [disabled]="disabled" 
      class="btn"
      [ngClass]="themeClass"> <!-- Usamos ngClass para aplicar la clase del tema -->
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.css']
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  
  // Nuevo Input para el tema
  @Input() theme: 'donor' | 'beneficiary' = 'donor';

  // Getter para construir la clase CSS dinámicamente
  get themeClass(): string {
    return `btn-${this.theme}`;
  }
}