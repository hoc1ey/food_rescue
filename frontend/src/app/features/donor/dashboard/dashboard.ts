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
import { LucideAngularModule, CheckCircle, Clock } from 'lucide-angular';
import { DonationsService, type DonationResponse } from '../../../core/services/donations';
import { AuthService } from '../../../core/services/auth';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ToastService } from '../../../core/services/toast.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Extendemos el tipo Donation para incluir el estado de confirmación en la UI
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
    LucideIconsModule,
    LucideAngularModule
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
  isLoading = false;
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

  // Iconos para la UI
  readonly icons = {
    checkCircle: CheckCircle,
    clock: Clock
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
      this.donations[index] = this.mapDonationResponse(updatedDonation);
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
    this.isLoading = true;
    this.errorMessage = null;

    this.donationsService.getDonations().subscribe({
      next: (response) => {
        console.log('🔍 API Response RAW:', response);           // ← AÑADE LÍNEA 1
        console.log('🔍 RAW first donation location:', response.data[0]?.location);  // ← AÑADE LÍNEA 2

        this.donations = response.data.map(donation => this.mapDonationResponse(donation));

        console.log('🔍 Donations MAPPED:', this.donations);      // ← AÑADE LÍNEA 3
        console.log('🔍 Primera donación FINAL:', this.donations[0]);  // ← AÑADE LÍNEA 4

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error cargando donaciones:', err);
        this.errorMessage = 'No se pudieron cargar las donaciones. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }

  private mapDonationResponse(donation: DonationResponse): DashboardDonation {
    const locationName = donation.location?.name || 'Ubicación no disponible';
    const addressParts = [];

    if (donation.location?.mainStreet) {
      addressParts.push(donation.location.mainStreet);
    }
    if (donation.location?.secondaryStreet) {
      addressParts.push('y ' + donation.location.secondaryStreet);
    }
    if (donation.location?.reference) {
      addressParts.push(', ' + donation.location.reference);
    }

    const address = addressParts.length > 0 ? addressParts.join(' ') : 'Dirección no disponible';

    // DEBUG
    console.log('🔍 MAPPING DEBUG:', {
      rawLocation: donation.location,
      locationName: locationName,
      addressParts: addressParts,
      finalAddress: address
    });

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
      donorConfirmed: donation.donorConfirmed,             // ✅ Estado del donante
      beneficiaryConfirmed: donation.beneficiaryConfirmed, // ✅ Estado del beneficiario
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
    this.isLoading = true;
    this.modalErrorMessage = null;

    // VALIDACIÓN: Aseguramos que quantity sea un número válido
    const quantityNum = Number(data.quantity);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      this.modalErrorMessage = 'La cantidad debe ser un número válido mayor a 0.';
      this.isLoading = false;
      return;
    }

    const donationData = {
      ...data,
      quantity: quantityNum
    };

    this.donationsService.createDonation(donationData).subscribe({
      next: (response) => {
        console.log('✅ Donación creada exitosamente:', response);

        // Mapeamos la respuesta para que tenga el formato correcto (incluyendo ubicación)
        const newDonation = this.mapDonationResponse(response.data);

        // Agregamos al inicio de la lista
        this.donations = [newDonation, ...this.donations];

        this.showNewDonationModal = false;
        this.modalErrorMessage = null;
        this.isLoading = false;
        this.showNotification(`Donación "${data.productName}" publicada exitosamente`);
      },
      error: (err) => {
        console.error('❌ Error al crear donación:', err);
        // Mostramos el mensaje exacto del backend si existe
        this.modalErrorMessage = err.error?.message || 'No se pudo crear la donación. Verifica los datos.';
        this.isLoading = false;
      }
    });
  }

  // --- Confirmar Entrega ---
  onConfirmDonation(donationId: string) {
    this.isLoading = true;
    this.donationsService.confirmDonation(donationId).subscribe({
      next: (response) => {
        console.log('✅ Entrega confirmada:', response);
        this.updateDonationInList(response.data);
        this.isLoading = false;
        this.showNotification(`Entrega de "${response.data.productName}" confirmada`);
      },
      error: (err) => {
        console.error('❌ Error al confirmar entrega:', err);
        this.errorMessage = 'No se pudo confirmar la entrega.';
        this.isLoading = false;
      }
    });
  }
}
