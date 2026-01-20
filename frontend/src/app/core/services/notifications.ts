import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface NotificationResponse {
    id: number;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    donationId: string | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);
    private apiUrl = 'http://localhost:3000/api/notifications';

    /**
     * Obtener todas las notificaciones del usuario autenticado
     */
    getNotifications(): Observable<ApiResponse<NotificationResponse[]>> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({ success: true, message: 'SSR skipped', data: [] });
        }
        return this.http.get<ApiResponse<NotificationResponse[]>>(this.apiUrl);
    }

    /**
     * Marcar una notificación como leída
     */
    markAsRead(notificationId: number): Observable<ApiResponse<NotificationResponse>> {
        return this.http.patch<ApiResponse<NotificationResponse>>(
            `${this.apiUrl}/${notificationId}/read`,
            {}
        );
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    markAllAsRead(): Observable<ApiResponse<{ updatedCount: number }>> {
        return this.http.patch<ApiResponse<{ updatedCount: number }>>(
            `${this.apiUrl}/all/read`,
            {}
        );
    }

    /**
     * Obtener el contador de notificaciones no leídas
     */
    getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({ success: true, message: 'SSR skipped', data: { count: 0 } });
        }
        return this.http.get<ApiResponse<{ count: number }>>(
            `${this.apiUrl}/unread-count`
        );
    }
}
