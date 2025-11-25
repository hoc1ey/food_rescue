import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css'
})
export class AppHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() theme: 'donor' | 'beneficiary' = 'donor';
  @Output() logoutClick = new EventEmitter<void>();

  onLogout() {
    this.logoutClick.emit();
  }
}
