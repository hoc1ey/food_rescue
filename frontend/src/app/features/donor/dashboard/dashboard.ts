import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { AppHeaderComponent } from '../../../shared/ui/molecules/app-header/app-header';
import { CardHeaderComponent } from '../../../shared/ui/molecules/card-header/card-header';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { DonationCardComponent } from '../../../shared/ui/molecules/donation-card/donation-card';
@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    AppHeaderComponent,
    CardHeaderComponent,
    ButtonComponent,
    DonationCardComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  private router = inject(Router);

  schedule = {
    days: 'Lunes-Viernes',
    time: '17:00 - 18:00',
    notes: 'Viernes por la noche y Domingos mediodía suelen tener más sobrantes'
  };

  recentDonations = [
    {
      id: 1,
      title: '15 Sándwiches de pollo',
      location: 'KFC Calle Mayor',
      time: 'Hoy antes de las 18:00',
      address: 'Calle Mayor 45, Madrid',
      status: 'Pendiente de reclamo'
    },
    {
      id: 2,
      title: '25 Sándwiches de pollo',
      location: 'KFC Calle Mayor',
      time: 'Hoy antes de las 18:00',
      address: 'Calle Mayor 45, Madrid',
      status: 'Pendiente de reclamo'
    }
  ];

  handleLogout() {
    this.router.navigate(['/login']);
  }

  onNewDonation() {
    console.log('Navegando a nueva donación...');
  }
}
