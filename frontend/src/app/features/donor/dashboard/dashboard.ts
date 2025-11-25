import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../../../shared/ui/molecules/app-header/app-header';
import { CardHeaderComponent } from '../../../shared/ui/molecules/card-header/card-header';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { CardDonationComponent, type Donation } from '../../../shared/ui/molecules/card-donation/card-donation';
import { CardScheduleComponent, type ScheduleData } from '../../../shared/ui/molecules/card-schedule/card-schedule';
import { ModalNewDonationComponent, type NewDonationData } from '../../../shared/ui/molecules/modal-new-donation/modal-new-donation';
import { LucideIconsModule } from '../../../shared/lucide-icons.module';

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
export class DashboardComponent {
  private router = inject(Router);

  // Control del modal
  showNewDonationModal = false;

  // Datos de ejemplo para el horario
  scheduleData: ScheduleData = {
    days: 'Lunes-Viernes',
    preferredTime: '17:00 - 18:00',
    notes: 'Ej. Viernes por la noche y Domingos mediodía suelen tener más sobrantes'
  };

  // Datos de ejemplo para las donaciones
  donations: Donation[] = [
    {
      id: '1',
      productName: 'Sándwiches de pollo',
      quantity: 15,
      unit: 'unidades',
      status: 'AVAILABLE',
      location: {
        name: 'KFC Calle Mayor',
        address: 'Calle Mayor 45, Madrid'
      },
      pickupTime: '18:00'
    },
    {
      id: '2',
      productName: 'Sándwiches de pollo',
      quantity: 25,
      unit: 'unidades',
      status: 'AVAILABLE',
      location: {
        name: 'KFC Calle Mayor',
        address: 'Calle Mayor 45, Madrid'
      },
      pickupTime: '18:00'
    }
  ];

  handleLogout() {
    console.log('Cerrando sesión...');
    // Aquí iría la lógica para limpiar el token de autenticación
    this.router.navigate(['/login']);
  }

  onNewDonation() {
    this.showNewDonationModal = true;
  }

  onModalClose() {
    this.showNewDonationModal = false;
  }

  onDonationSubmit(data: NewDonationData) {
    console.log('Creando donación:', data);
    // TODO: Aquí irá la llamada al servicio para crear la donación
    // Por ahora solo cerramos el modal
    this.showNewDonationModal = false;
  }
}
