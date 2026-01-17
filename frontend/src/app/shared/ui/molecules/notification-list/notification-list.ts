import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService, NotificationResponse } from '../../../../core/services/notifications';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { LucideAngularModule, X, Check, CheckCheck, Trash2, Bell } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-notification-list',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './notification-list.html',
    styleUrl: './notification-list.css'
})
export class NotificationListComponent implements OnInit, OnDestroy {
    readonly X = X;
    readonly Check = Check;
    readonly CheckCheck = CheckCheck;
    readonly Trash2 = Trash2;
    readonly Bell = Bell;

    notifications: NotificationResponse[] = [];
    loading = false;
    error = '';
    private destroy$ = new Subject<void>();

    constructor(
        private notificationsService: NotificationsService,
        private wsService: WebSocketService
    ) { }

    ngOnInit(): void {
        this.loadNotifications();
        this.setupWebSocketListener();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupWebSocketListener(): void {
        this.wsService.onNotification()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (notification) => {
                    if (notification) {
                        console.log('Nueva notificación recibida:', notification);
                        this.notifications.unshift(notification);
                    }
                },
                error: (err: any) => console.error('Error en WebSocket notifications:', err)
            });
    }

    loadNotifications(): void {
        this.loading = true;
        this.error = '';

        this.notificationsService.getNotifications()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.notifications = response.data;
                    this.loading = false;
                },
                error: (err: any) => {
                    console.error('Error al cargar notificaciones:', err);
                    this.error = 'Error al cargar las notificaciones';
                    this.loading = false;
                }
            });
    }

    markAsRead(notificationId: number): void {
        this.notificationsService.markAsRead(notificationId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    const notification = this.notifications.find((n: NotificationResponse) => n.id === notificationId);
                    if (notification) {
                        notification.isRead = true;
                    }
                },
                error: (err: any) => {
                    console.error('Error al marcar como leída:', err);
                }
            });
    }

    markAllAsRead(): void {
        this.notificationsService.markAllAsRead()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notifications.forEach((n: NotificationResponse) => n.isRead = true);
                },
                error: (err: any) => {
                    console.error('Error al marcar todas como leídas:', err);
                }
            });
    }

    deleteNotification(notificationId: number): void {
        this.notifications = this.notifications.filter((n: NotificationResponse) => n.id !== notificationId);
    }

    getNotificationIcon(type: string): string {
        switch (type) {
            case 'DONATION_CREATED':
                return '🎁';
            case 'DONATION_CLAIMED':
                return '✅';
            case 'DONATION_DELIVERED':
                return '🚚';
            default:
                return '📢';
        }
    }

    getNotificationClass(type: string): string {
        switch (type) {
            case 'DONATION_CREATED':
                return 'notification-created';
            case 'DONATION_CLAIMED':
                return 'notification-claimed';
            case 'DONATION_DELIVERED':
                return 'notification-delivered';
            default:
                return 'notification-default';
        }
    }

    getTimeAgo(date: string): string {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInMs = now.getTime() - notificationDate.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return 'Ahora';
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
        if (diffInHours < 24) return `Hace ${diffInHours}h`;
        if (diffInDays === 1) return 'Ayer';
        if (diffInDays < 7) return `Hace ${diffInDays} días`;
        return notificationDate.toLocaleDateString('es-ES');
    }

    get unreadCount(): number {
        return this.notifications.filter((n: NotificationResponse) => !n.isRead).length;
    }

    get hasUnread(): boolean {
        return this.unreadCount > 0;
    }
}
