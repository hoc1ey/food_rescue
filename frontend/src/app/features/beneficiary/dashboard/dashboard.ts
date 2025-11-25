import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../../../shared/ui/molecules/app-header/app-header';
import { NotificationBannerComponent } from '../../../shared/ui/molecules/notification-banner/notification-banner';
import { CardHeaderComponent } from '../../../shared/ui/molecules/card-header/card-header';
import { CardDonationComponent, type Donation } from '../../../shared/ui/molecules/card-donation/card-donation';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { LucideIconsModule } from '../../../shared/lucide-icons.module';
import { DonationsService, type DonationResponse } from '../../../core/services/donations';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-beneficiary-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    NotificationBannerComponent,
    CardHeaderComponent,
    CardDonationComponent,
    ButtonComponent,
    LucideIconsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private donationsService = inject(DonationsService);
  private authService = inject(AuthService);

  notificationCount = 1;
  isLoading = false;
  errorMessage: string | null = null;  // Donaciones disponibles para reclamar
  availableDonations: Donation[] = [];

  ngOnInit(): void {
    this.loadAvailableDonations();
  }

  loadAvailableDonations(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.donationsService.getDonations().subscribe({
      next: (response) => {
        // Mapear la respuesta del backend al formato de las tarjetas
        this.availableDonations = response.data.map(donation => this.mapDonationResponse(donation));
        this.isLoading = false;

        // Actualizar contador de notificaciones con donaciones nuevas
        this.notificationCount = this.availableDonations.filter(d => d.status === 'AVAILABLE').length;
      },
      error: (err) => {
        console.error('Error al cargar donaciones:', err);
        this.errorMessage = 'No se pudieron cargar las donaciones disponibles.';
        this.isLoading = false;
      }
    });
  }

  private mapDonationResponse(donation: DonationResponse): Donation {
    return {
      id: donation.id,
      productName: donation.productName,
      quantity: donation.quantity,
      unit: donation.unit,
      status: donation.status,
      location: {
        name: donation.donor?.name || 'Ubicación no disponible',
        address: donation.donor?.address || 'Dirección no disponible'
      },
      pickupTime: new Date(donation.createdAt).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }

  handleLogout() {
    console.log('Cerrando sesión...');
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  onClaimDonation(donation: Donation) {
    this.isLoading = true;
    this.errorMessage = null;

    this.donationsService.claimDonation(donation.id).subscribe({
      next: (response) => {
        console.log('Donación reclamada exitosamente:', response);

        // Actualizar el estado de la donación en la lista
        const index = this.availableDonations.findIndex(d => d.id === donation.id);
        if (index !== -1) {
          this.availableDonations[index].status = 'ASSIGNED';
        }

        // Recargar las donaciones para obtener datos actualizados
        this.loadAvailableDonations();
      },
      error: (err) => {
        console.error('Error al reclamar donación:', err);
        this.errorMessage = 'No se pudo reclamar la donación. Puede que ya no esté disponible.';
        this.isLoading = false;
      }
    });
  }
}
