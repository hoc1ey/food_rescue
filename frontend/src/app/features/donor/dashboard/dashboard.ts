import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../../../shared/ui/molecules/app-header/app-header';
import { CardHeaderComponent } from '../../../shared/ui/molecules/card-header/card-header';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { CardDonationComponent, type Donation } from '../../../shared/ui/molecules/card-donation/card-donation';
import { CardScheduleComponent, type ScheduleData } from '../../../shared/ui/molecules/card-schedule/card-schedule';
import { ModalNewDonationComponent, type NewDonationData } from '../../../shared/ui/molecules/modal-new-donation/modal-new-donation';
import { LucideIconsModule } from '../../../shared/lucide-icons.module';
import { DonationsService, type DonationResponse } from '../../../core/services/donations';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    CardHeaderComponent,
    ButtonComponent,
    CardDonationComponent,
    CardScheduleComponent,
    ModalNewDonationComponent,
    LucideIconsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private donationsService = inject(DonationsService);
  private authService = inject(AuthService);

  // Control del modal
  showNewDonationModal = false;
  isLoading = false;
  errorMessage: string | null = null;

  // Datos de ejemplo para el horario
  scheduleData: ScheduleData = {
    days: 'Lunes-Viernes',
    preferredTime: '17:00 - 18:00',
    notes: 'Ej. Viernes por la noche y Domingos mediodía suelen tener más sobrantes'
  };

  // Donaciones del donante
  donations: Donation[] = [];

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.donationsService.getDonations().subscribe({
      next: (response) => {
        // Mapear la respuesta del backend al formato de las tarjetas
        this.donations = response.data.map(donation => this.mapDonationResponse(donation));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar donaciones:', err);
        this.errorMessage = 'No se pudieron cargar las donaciones. Intenta de nuevo.';
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

  onNewDonation() {
    this.showNewDonationModal = true;
  }

  onModalClose() {
    this.showNewDonationModal = false;
  }

  onDonationSubmit(data: NewDonationData) {
    this.isLoading = true;
    this.errorMessage = null;

    this.donationsService.createDonation(data).subscribe({
      next: (response) => {
        console.log('Donación creada exitosamente:', response);
        // Agregar la nueva donación a la lista
        const newDonation = this.mapDonationResponse(response.data);
        this.donations = [newDonation, ...this.donations];

        // Cerrar modal y resetear estado
        this.showNewDonationModal = false;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al crear donación:', err);
        this.errorMessage = 'No se pudo crear la donación. Verifica tu sesión.';
        this.isLoading = false;
        // Mantener el modal abierto para que el usuario pueda reintentar
      }
    });
  }
}
