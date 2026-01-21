import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../../../shared/ui/molecules/app-header/app-header';
import { NotificationBannerComponent } from '../../../shared/ui/molecules/notification-banner/notification-banner';
import { CardHeaderComponent } from '../../../shared/ui/molecules/card-header/card-header';
import { CardDonationComponent, type Donation } from '../../../shared/ui/molecules/card-donation/card-donation';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { TabGroupComponent } from '../../../shared/ui/molecules/tab-group/tab-group';
import { ToastContainerComponent } from '../../../shared/ui/atoms/toast/toast-container';
import { LucideIconsModule } from '../../../shared/lucide-icons.module';
import { DonationsService, type DonationResponse } from '../../../core/services/donations';
import { NotificationsService, type NotificationResponse } from '../../../core/services/notifications';
import { AuthService } from '../../../core/services/auth';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Extendemos el tipo Donation para manejar el estado visual de confirmación
type DashboardDonation = Donation & {
  beneficiaryConfirmed?: boolean;
  donorConfirmed?: boolean;
};

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
    TabGroupComponent,
    ToastContainerComponent,
    LucideIconsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private donationsService = inject(DonationsService);
  private notificationsService = inject(NotificationsService);
  private authService = inject(AuthService);
  private websocketService = inject(WebSocketService);
  private toastService = inject(ToastService);

  @ViewChild(ToastContainerComponent) toastContainer?: ToastContainerComponent;

  // Subscripciones para limpieza
  private subscriptions: Subscription[] = [];

  isLoading = false;
  errorMessage: string | null = null;

  // Notificaciones
  notifications: NotificationResponse[] = [];
  loadingNotifications = false;

  // Estado de conexión WebSocket
  isWebSocketConnected = false;

  // Todas las donaciones del beneficiario (disponibles y reclamadas)
  allDonations: DashboardDonation[] = [];

  // Control de filtros
  donationFilterTab: 'available' | 'pending' | 'delivered' = 'available';
  donationFilterTabs = ['Disponibles', 'Pendientes', 'Entregadas'];

  // Donaciones filtradas según el tab activo
  get filteredDonations(): DashboardDonation[] {
    switch (this.donationFilterTab) {
      case 'available':
        return this.allDonations.filter(d => d.status === 'AVAILABLE');
      case 'pending':
        return this.allDonations.filter(d => d.status === 'ASSIGNED');
      case 'delivered':
        return this.allDonations.filter(d => d.status === 'DELIVERED');
      default:
        return this.allDonations;
    }
  }

  // Contador de donaciones filtradas
  get filteredCount(): number {
    return this.filteredDonations.length;
  }

  // Getter para contar solo las donaciones con estado AVAILABLE (para el banner)
  get availableCount(): number {
    return this.allDonations.filter(d => d.status === 'AVAILABLE').length;
  }

  // Contador de notificaciones no leídas
  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  ngOnInit(): void {
    this.loadAvailableDonations();
    this.setupWebSocketListeners();
    // Cargar notificaciones en segundo plano
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    // Limpiar todas las subscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Configurar listeners de WebSocket para actualizaciones en tiempo real
   */
  private setupWebSocketListeners(): void {
    // Autenticar usuario en WebSocket para recibir notificaciones personales
    const userId = this.authService.getUserId();
    if (userId) {
      this.websocketService.authenticate(userId);
      console.log('🔐 Usuario autenticado en WebSocket:', userId);
    }

    // Escuchar estado de conexión
    const connectionSub = this.websocketService.getConnectionStatus()
      .subscribe(isConnected => {
        this.isWebSocketConnected = isConnected;
        console.log(`WebSocket ${isConnected ? 'conectado ✅' : 'desconectado ❌'}`);

        // Re-autenticar si se reconecta
        if (isConnected && userId) {
          this.websocketService.authenticate(userId);
        }
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

    // Escuchar notificaciones en tiempo real
    const notificationSub = this.websocketService.onNotification()
      .pipe(filter(notification => notification !== null))
      .subscribe(notification => {
        if (notification) {
          console.log('🔔 Nueva notificación recibida:', notification);
          this.handleNewNotification(notification);
        }
      });

    // Guardar subscripciones para limpiar después
    this.subscriptions.push(connectionSub, createdSub, claimedSub, deliveredSub, notificationSub);
  }

  /**
   * Agregar nueva donación a la lista cuando llega en tiempo real
   */
  private addNewDonationToList(newDonation: DonationResponse): void {
    // Verificar si ya existe para evitar duplicados
    const exists = this.allDonations.some(d => d.id === newDonation.id);
    if (!exists) {
      // Agregar al inicio de la lista
      this.allDonations.unshift(this.mapDonationResponse(newDonation));
    }
  }

  /**
   * Actualizar una donación en la lista cuando se recibe un evento
   */
  private updateDonationInList(updatedDonation: DonationResponse): void {
    console.log('🔄 Actualizando lista con:', updatedDonation);
    const index = this.allDonations.findIndex(d => d.id === updatedDonation.id);
    if (index !== -1) {
      // Actualizar la donación existente
      const currentDonation = this.allDonations[index];
      const mappedDonation = this.mapDonationResponse(updatedDonation);

      // Preservar datos del donante y dirección si vienen vacíos en la actualización del backend
      if (mappedDonation.location.name === 'Donador no disponible' && currentDonation.location.name !== 'Donador no disponible') {
        mappedDonation.location.name = currentDonation.location.name;
      }
      if (mappedDonation.location.address === 'Dirección no disponible' && currentDonation.location.address !== 'Dirección no disponible') {
        mappedDonation.location.address = currentDonation.location.address;
      }

      this.allDonations[index] = mappedDonation;
    }
  }

  /**
   * Remover una donación de la lista
   */
  private removeDonationFromList(donationId: string): void {
    this.allDonations = this.allDonations.filter(d => d.id !== donationId);
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
        this.allDonations = response.data.map(donation => this.mapDonationResponse(donation));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar donaciones:', err);
        this.errorMessage = 'No se pudieron cargar las donaciones disponibles.';
        this.isLoading = false;
      }
    });
  }

  private mapDonationResponse(donation: DonationResponse): DashboardDonation {
    const donorName = donation.donor?.user
      ? `${donation.donor.user.firstName} ${donation.donor.user.lastName}`
      : 'Donador no disponible';

    const loc = donation.location;
    let address = 'Dirección no disponible';

    if (loc) {
      const parts = [];
      if (loc.mainStreet) parts.push(loc.mainStreet);
      if (loc.secondaryStreet) parts.push(loc.secondaryStreet);

      if (parts.length > 0) {
        address = parts.join(' y ');
      }

      if (loc.reference) {
        address += `, ${loc.reference}`;
      }
    }

    return {
      id: donation.id,
      productName: donation.productName,
      quantity: donation.quantity,
      unit: donation.unit,
      status: donation.status,
      location: {
        name: donorName,
        address: address
      },
      beneficiaryConfirmed: donation.beneficiaryConfirmed ?? false, // Aseguramos false si es null
      donorConfirmed: donation.donorConfirmed ?? false,             // Aseguramos false si es null
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
        console.log('✅ Donación reclamada exitosamente:', response);

        // Actualizar el estado de la donación en la lista
        const index = this.allDonations.findIndex(d => d.id === donation.id);
        if (index !== -1) {
          this.allDonations[index].status = 'ASSIGNED';
        }

        this.isLoading = false;

        // Mostrar notificación de éxito
        this.showNotification(`Donación "${donation.productName}" reclamada exitosamente`);
      },
      error: (err) => {
        console.error('❌ Error al reclamar donación:', err);
        this.errorMessage = 'No se pudo reclamar la donación. Puede que ya no esté disponible.';
        this.isLoading = false;
      }
    });
  }

  // --- Cargar notificaciones en segundo plano ---
  private loadNotifications(): void {
    this.loadingNotifications = true;
    this.notificationsService.getNotifications().subscribe({
      next: (response) => {
        this.notifications = response.data;
        this.loadingNotifications = false;
      },
      error: (err) => {
        console.error('Error al cargar notificaciones:', err);
        this.loadingNotifications = false;
      }
    });
  }

  // --- Métodos para filtrado de donaciones ---
  onDonationFilterChange(tab: string): void {
    if (tab === 'Disponibles') {
      this.donationFilterTab = 'available';
    } else if (tab === 'Pendientes') {
      this.donationFilterTab = 'pending';
    } else if (tab === 'Entregadas') {
      this.donationFilterTab = 'delivered';
    }
  }

  /**
   * Manejar nueva notificación recibida vía WebSocket
   */
  private handleNewNotification(notification: NotificationResponse): void {
    // Agregar a la lista de notificaciones
    this.notifications.unshift(notification);

    // Mostrar toast según el tipo
    const toastTitle = this.getNotificationTitle(notification.type);
    this.toastContainer?.addToast({
      type: this.getNotificationToastType(notification.type),
      title: toastTitle,
      message: notification.message,
      duration: 6000
    });
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'DONATION_CREATED':
        return 'Nueva Donación';
      case 'DONATION_CLAIMED':
        return 'Donación Reclamada';
      case 'DONATION_DELIVERED':
        return 'Donación Entregada';
      default:
        return 'Notificación';
    }
  }

  private getNotificationToastType(type: string): 'success' | 'info' | 'warning' | 'error' {
    switch (type) {
      case 'DONATION_CREATED':
        return 'info';
      case 'DONATION_CLAIMED':
        return 'warning';
      case 'DONATION_DELIVERED':
        return 'success';
      default:
        return 'info';
    }
  }

  // --- Métodos para Confirmación ---
  onConfirmDonation(donationId: string | number): void {
    this.isLoading = true;
    this.donationsService.confirmDonation(String(donationId)).subscribe({ // Convertimos a String por seguridad
      next: (response) => {
        console.log('\u2705 Donaci\u00f3n confirmada:', response);
        this.updateDonationInList(response.data);
        this.isLoading = false;
        this.showNotification(`Donaci\u00f3n \"${response.data.productName}\" confirmada exitosamente`);
      },
      error: (err) => {
        console.error('\u274c Error al confirmar donaci\u00f3n:', err);
        this.errorMessage = 'No se pudo confirmar la donaci\u00f3n';
        this.isLoading = false;
      }
    });
  }
}
