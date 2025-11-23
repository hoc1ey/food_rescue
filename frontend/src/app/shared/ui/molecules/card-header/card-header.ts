import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '../../../lucide-icons.module';

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [
    CommonModule, 
    LucideIconsModule
  ],
  templateUrl: './card-header.html',
  styleUrl: './card-header.css'
})
export class CardHeaderComponent {
  @Input() title: string = '';
  @Input() icon: string = 'info'; 
  @Input() theme: 'donor' | 'beneficiary' = 'donor';
}