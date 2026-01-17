import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    private apiUrl = 'http://localhost:3000/api/notifications';

    /**
     * Obtener todas las notificaciones del usuario autenticado
     */
    getNotifications(): Observable<ApiResponse<NotificationResponse[]>> {
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
        return this.http.get<ApiResponse<{ count: number }>>(
            `${this.apiUrl}/unread-count`
        );
    }
}
