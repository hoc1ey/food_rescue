import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
import { WebSocketService } from '../../../core/services/websocket.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
export class DashboardComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private donationsService = inject(DonationsService);
  private authService = inject(AuthService);
  private websocketService = inject(WebSocketService);

  // Subscripciones para limpieza
  private subscriptions: Subscription[] = [];

  notificationCount = 1;
  isLoading = false;
  errorMessage: string | null = null;

  // Estado de conexión WebSocket
  isWebSocketConnected = false;

  // Donaciones disponibles para reclamar
  availableDonations: Donation[] = [];

  // Getter para contar solo las donaciones con estado AVAILABLE
  get availableCount(): number {
    return this.availableDonations.filter(d => d.status === 'AVAILABLE').length;
  }

  ngOnInit(): void {
    this.loadAvailableDonations();
    this.setupWebSocketListeners();
  }

  ngOnDestroy(): void {
    // Limpiar todas las subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Configurar listeners de WebSocket para actualizaciones en tiempo real
   */
  private setupWebSocketListeners(): void {
    // Escuchar estado de conexión
    const connectionSub = this.websocketService.getConnectionStatus()
      .subscribe(isConnected => {
        this.isWebSocketConnected = isConnected;
        console.log(`WebSocket ${isConnected ? 'conectado ✅' : 'desconectado ❌'}`);
      });

    // Escuchar cuando se crea una nueva donación
    const createdSub = this.websocketService.onDonationCreated()
      .pipe(filter(donation => donation !== null))
      .subscribe(donation => {
        if (donation) {
          console.log('🎁 Nueva donación disponible:', donation);
          this.addNewDonationToList(donation);
          // Mostrar notificación al usuario
          this.showNotification(`Nueva donación disponible: ${donation.productName}`);
          // Incrementar contador de notificaciones
          this.notificationCount++;
        }
      });

    // Escuchar cuando una donación es reclamada (por este u otro beneficiario)
    const claimedSub = this.websocketService.onDonationClaimed()
      .pipe(filter(donation => donation !== null))
      .subscribe(donation => {
        if (donation) {
          console.log('🔄 Donación reclamada:', donation);
          this.updateDonationInList(donation);
        }
      });

    // Escuchar cuando una donación es entregada
    const deliveredSub = this.websocketService.onDonationDelivered()
      .pipe(filter(donation => donation !== null))
      .subscribe(donation => {
        if (donation) {
          console.log('✅ Donación entregada:', donation);
          this.removeDonationFromList(donation.id);
        }
      });

    // Guardar subscripciones para limpiar después
    this.subscriptions.push(connectionSub, createdSub, claimedSub, deliveredSub);
  }

  /**
   * Agregar nueva donación a la lista cuando llega en tiempo real
   */
  private addNewDonationToList(newDonation: DonationResponse): void {
    // Verificar si ya existe para evitar duplicados
    const exists = this.availableDonations.some(d => d.id === newDonation.id);
    if (!exists) {
      // Agregar al inicio de la lista
      this.availableDonations.unshift(this.mapDonationResponse(newDonation));
    }
  }

  /**
   * Actualizar una donación en la lista cuando se recibe un evento
   */
  private updateDonationInList(updatedDonation: DonationResponse): void {
    const index = this.availableDonations.findIndex(d => d.id === updatedDonation.id);
    if (index !== -1) {
      // Actualizar la donación existente
      this.availableDonations[index] = this.mapDonationResponse(updatedDonation);
    }
  }

  /**
   * Remover una donación de la lista
   */
  private removeDonationFromList(donationId: string): void {
    this.availableDonations = this.availableDonations.filter(d => d.id !== donationId);
  }

  /**
   * Mostrar notificación al usuario
   */
  private showNotification(message: string): void {
    console.log('📢 Notificación:', message);

    // Verificar que estamos en el navegador (no en SSR)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Food Rescue - Nueva Donación', {
        body: message,
        icon: '/favicon.ico'
      });
    }
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
    const donorName = donation.donor?.user
      ? `${donation.donor.user.firstName} ${donation.donor.user.lastName}`
      : 'Donador no disponible';

    return {
      id: donation.id,
      productName: donation.productName,
      quantity: donation.quantity,
      unit: donation.unit,
      status: donation.status,
      location: {
        name: donorName,
        address: donation.location?.address || 'Dirección no disponible'
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

        // Decrementar el contador de notificaciones ya que ya no está disponible
        if (this.notificationCount > 0) {
          this.notificationCount--;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al reclamar donación:', err);
        this.errorMessage = 'No se pudo reclamar la donación. Puede que ya no esté disponible.';
        this.isLoading = false;
      }
    });
  }
}
