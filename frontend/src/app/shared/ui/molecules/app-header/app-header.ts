import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button';
import { NotificationListComponent } from '../notification-list/notification-list';
import { NotificationsService } from '../../../../core/services/notifications';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { LucideAngularModule, Bell, LogOut } from 'lucide-angular';
import { Subject, takeUntil, interval } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NotificationListComponent, LucideAngularModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css'
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  readonly Bell = Bell;
  readonly LogOut = LogOut;

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() theme: 'donor' | 'beneficiary' = 'donor';
  @Output() logoutClick = new EventEmitter<void>();

  showNotificationPanel = false;
  unreadCount = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private notificationsService: NotificationsService,
    private wsService: WebSocketService
  ) { }

  ngOnInit(): void {
    this.loadUnreadCount();
    this.setupWebSocketListener();
    // Actualizar el contador cada 30 segundos
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadUnreadCount());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupWebSocketListener(): void {
    this.wsService.onNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Cuando llega una nueva notificación, actualizar el contador
          this.loadUnreadCount();
        },
        error: (err) => console.error('Error en WebSocket notifications:', err)
      });
  }

  private loadUnreadCount(): void {
    this.notificationsService.getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.unreadCount = response.data.count;
        },
        error: (err) => {
          console.error('Error al cargar contador de no leídas:', err);
        }
      });
  }

  toggleNotificationPanel(): void {
    this.showNotificationPanel = !this.showNotificationPanel;
  }

  closeNotificationPanel(): void {
    this.showNotificationPanel = false;
  }

  onLogout(): void {
    this.logoutClick.emit();
  }
}
