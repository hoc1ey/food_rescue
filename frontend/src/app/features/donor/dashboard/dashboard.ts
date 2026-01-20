import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../../../shared/ui/molecules/app-header/app-header';
import { CardHeaderComponent } from '../../../shared/ui/molecules/card-header/card-header';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { CardDonationComponent, type Donation } from '../../../shared/ui/molecules/card-donation/card-donation';
import { CardScheduleComponent, type ScheduleData } from '../../../shared/ui/molecules/card-schedule/card-schedule';
import { ModalNewDonationComponent, type NewDonationData } from '../../../shared/ui/molecules/modal-new-donation/modal-new-donation';
import { TabGroupComponent } from '../../../shared/ui/molecules/tab-group/tab-group';
import { ToastContainerComponent } from '../../../shared/ui/atoms/toast/toast-container';
import { LucideIconsModule } from '../../../shared/lucide-icons.module';
import { DonationsService, type DonationResponse } from '../../../core/services/donations';
import { AuthService } from '../../../core/services/auth';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

type DashboardDonation = Donation & {
  beneficiaryConfirmed?: boolean;
  donorConfirmed?: boolean;
};

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
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  @ViewChild(ToastContainerComponent) toastContainer?: ToastContainerComponent;
  private websocketService = inject(WebSocketService);

  // Subscripciones para limpieza
  private subscriptions: Subscription[] = [];

  // Control del modal
  showNewDonationModal = false;
  isInitialLoading = false; // Carga inicial
  isActionLoading = false;  // Acciones (botones)
  errorMessage: string | null = null;
  modalErrorMessage: string | null = null;

  // Estado de conexión WebSocket
  isWebSocketConnected = false;

  // Datos de ejemplo para el horario
  scheduleData: ScheduleData = {
    days: 'Lunes-Viernes',
    preferredTime: '17:00 - 18:00',
    notes: 'Ej. Viernes por la noche y Domingos mediodía suelen tener más sobrantes'
  };

  // Donaciones del donante
  donations: DashboardDonation[] = [];

  // Control de filtros de donaciones
  donationFilterTab: 'available' | 'pending' | 'delivered' = 'available';
  donationFilterTabs = ['Disponibles', 'Pendientes', 'Entregados'];

  // Donaciones filtradas según el tab activo
  get filteredDonations(): DashboardDonation[] {
    switch (this.donationFilterTab) {
      case 'available':
        return this.donations.filter(d => d.status === 'AVAILABLE');
      case 'pending':
        return this.donations.filter(d => d.status === 'ASSIGNED');
      case 'delivered':
        return this.donations.filter(d => d.status === 'DELIVERED');
      default:
        return this.donations;
    }
  }

  // Contador de donaciones filtradas
  get filteredCount(): number {
    return this.filteredDonations.length;
  }

  ngOnInit(): void {
    this.loadDonations();
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

    // Escuchar cuando una donación es reclamada
    const claimedSub = this.websocketService.onDonationClaimed()
      .pipe(filter(donation => donation !== null))
      .subscribe(donation => {
        if (donation) {
          console.log('🔄 Actualizando donación reclamada:', donation);
          this.updateDonationInList(donation);
          // Mostrar notificación al usuario
          this.showNotification(`Tu donación "${donation.productName}" ha sido reclamada`);
        }
      });

    // Escuchar cuando una donación es entregada
    const deliveredSub = this.websocketService.onDonationDelivered()
      .pipe(filter(donation => donation !== null))
      .subscribe(donation => {
        if (donation) {
          console.log('🔄 Actualizando donación entregada:', donation);
          this.updateDonationInList(donation);
          // Mostrar notificación al usuario
          this.showNotification(`Tu donación "${donation.productName}" ha sido entregada exitosamente`);
        }
      });

    // Escuchar notificaciones en tiempo real
    const notificationSub = this.websocketService.onNotification()
      .pipe(filter(notification => notification !== null))
      .subscribe(notification => {
        if (notification) {
          console.log('🔔 Nueva notificación recibida:', notification);
          this.toastContainer?.addToast({
            type: 'info',
            title: 'Nueva Notificación',
            message: notification.message,
            duration: 6000
          });
        }
      });

    // Guardar subscripciones para limpiar después
    this.subscriptions.push(connectionSub, claimedSub, deliveredSub, notificationSub);
  }

  /**
   * Actualizar una donación en la lista cuando se recibe un evento
   */
  private updateDonationInList(updatedDonation: DonationResponse): void {
    const index = this.donations.findIndex(d => d.id === updatedDonation.id);
    if (index !== -1) {
      // Actualizar la donación existente
      const currentDonation = this.donations[index];
      const mappedDonation = this.mapDonationResponse(updatedDonation);

      // Preservar datos de ubicación si vienen vacíos en la actualización
      if (mappedDonation.location.name === 'Ubicación no disponible' && currentDonation.location.name !== 'Ubicación no disponible') {
        mappedDonation.location.name = currentDonation.location.name;
      }
      if (mappedDonation.location.address === 'Dirección no disponible' && currentDonation.location.address !== 'Dirección no disponible') {
        mappedDonation.location.address = currentDonation.location.address;
      }

      this.donations[index] = mappedDonation;
    } else {
      // Si no existe, agregarla (por si acaso)
      this.donations.unshift(this.mapDonationResponse(updatedDonation));
    }
  }

  /**
   * Mostrar notificación al usuario
   */
  private showNotification(message: string): void {
    // Aquí podrías usar un servicio de notificaciones más sofisticado
    // Por ahora usamos console.log y podrías agregar un toast/snackbar
    console.log('📢 Notificación:', message);

    // Verificar que estamos en el navegador (no en SSR)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Food Rescue - Actualización', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }

  loadDonations(): void {
    this.isInitialLoading = true;
    this.errorMessage = null;

    this.donationsService.getDonations().subscribe({
      next: (response) => {
        // Mapear la respuesta del backend al formato de las tarjetas
        this.donations = response.data.map(donation => this.mapDonationResponse(donation));
        this.isInitialLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar donaciones:', err);
        this.errorMessage = 'No se pudieron cargar las donaciones. Intenta de nuevo.';
        this.isInitialLoading = false;
      }
    });
  }

  private mapDonationResponse(donation: DonationResponse): DashboardDonation {
    // Recuperamos los datos de ubicación del backend
    const loc = donation.location;

    let address = 'Dirección no disponible';
    let locationName = 'Ubicación no disponible';

    if (loc) {
      // Preferimos el nombre del lugar (ej. "Casa"), si no, la ciudad
      locationName = loc.name || loc.city?.name || 'Ubicación no disponible';

      // Construimos la dirección: "Calle Principal y Calle Secundaria, Referencia"
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
        name: locationName,
        address: address
      },
      donorConfirmed: donation.donorConfirmed ?? false,             // Aseguramos false si es null
      beneficiaryConfirmed: donation.beneficiaryConfirmed ?? false, // Aseguramos false si es null
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
    this.modalErrorMessage = null;
  }

  onDonationFilterChange(tab: string): void {
    if (tab === 'Disponibles') {
      this.donationFilterTab = 'available';
    } else if (tab === 'Pendientes') {
      this.donationFilterTab = 'pending';
    } else if (tab === 'Entregados') {
      this.donationFilterTab = 'delivered';
    }
  }

  onDonationSubmit(data: NewDonationData) {
    console.log('📝 Datos recibidos del modal:', data);
    this.isActionLoading = true;
    this.modalErrorMessage = null;

    this.donationsService.createDonation(data).subscribe({
      next: (response) => {
        console.log('✅ Donación creada exitosamente:', response);
        // Agregar la nueva donación a la lista
        const newDonation = this.mapDonationResponse(response.data);
        this.donations = [newDonation, ...this.donations];

        // Cerrar modal y resetear estado
        this.showNewDonationModal = false;
        this.modalErrorMessage = null;
        this.isActionLoading = false;

        // Mostrar notificación de éxito
        this.showNotification(`Donación "${data.productName}" publicada exitosamente`);
      },
      error: (err) => {
        console.error('❌ Error al crear donación:', err);
        this.modalErrorMessage = 'No se pudo crear la donación. Verifica tu sesión e intenta nuevamente.';
        this.isActionLoading = false;
        // Mantener el modal abierto para que el usuario pueda reintentar
      }
    });
  }

  // --- Confirmar Entrega ---
  onConfirmDonation(donationId: string | number) {
    this.isActionLoading = true;
    this.donationsService.confirmDonation(String(donationId)).subscribe({
      next: (response) => {
        console.log('✅ Entrega confirmada:', response);
        this.updateDonationInList(response.data);
        this.isActionLoading = false;
        this.showNotification(`Entrega de "${response.data.productName}" confirmada`);
      },
      error: (err) => {
        console.error('❌ Error al confirmar entrega:', err);
        this.errorMessage = 'No se pudo confirmar la entrega.';
        this.isActionLoading = false;
      }
    });
  }
}
