import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '../../../lucide-icons.module';

export interface Donation {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'DELIVERED';
  location: {
    name: string;
    address: string;
  };
  pickupTime: string;
}

@Component({
  selector: 'app-card-donation',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './card-donation.html',
  styleUrl: './card-donation.css'
})
export class CardDonationComponent {
  @Input() donation!: Donation;
  @Input() theme: 'donor' | 'beneficiary' = 'donor';

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'AVAILABLE': 'Disponible',
      'ASSIGNED': 'Asignado',
      'DELIVERED': 'Entregado'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
