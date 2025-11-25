import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-donation-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule], // Importamos iconos y directivas comunes
  templateUrl: './donation-card.html',
  styleUrl: './donation-card.css'
})
export class DonationCardComponent {
  @Input() donation: any;
}
