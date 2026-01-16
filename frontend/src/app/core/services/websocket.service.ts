import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { DonationResponse } from './donations';
import { NotificationResponse } from './notifications';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private socket: Socket | null = null;
    private readonly serverUrl = 'http://localhost:3000';

    // Observable para el estado de conexión
    private connectionStatus$ = new BehaviorSubject<boolean>(false);

    // Observables para los diferentes eventos de donaciones
    private donationCreated$ = new BehaviorSubject<DonationResponse | null>(null);
    private donationClaimed$ = new BehaviorSubject<DonationResponse | null>(null);
    private donationDelivered$ = new BehaviorSubject<DonationResponse | null>(null);

    // Observable para notificaciones en tiempo real
    private notification$ = new BehaviorSubject<NotificationResponse | null>(null);

    constructor() {
        this.connect();
    }

    /**
     * Conectar al servidor WebSocket
     */
    connect(): void {
        if (this.socket?.connected) {
            console.log('⚠️ Socket ya está conectado');
            return;
        }

        console.log('🔄 Conectando al servidor WebSocket...');

        this.socket = io(this.serverUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.setupEventListeners();
    }

    /**
     * Autenticar usuario en WebSocket para recibir notificaciones personales
     */
    authenticate(userId: string): void {
        if (this.socket?.connected) {
            console.log('🔐 Autenticando usuario en WebSocket:', userId);
            this.socket.emit('authenticate', userId);

            // Escuchar confirmación de autenticación
            this.socket.once('authenticated', (response: any) => {
                console.log('✅ Usuario autenticado en WebSocket:', response);
            });
        } else {
            console.warn('⚠️ No se puede autenticar: Socket no conectado');
            // Reintentar autenticación cuando se conecte
            this.socket?.once('connect', () => {
                this.authenticate(userId);
            });
        }
    }

    /**
     * Configurar los listeners de eventos
     */
    private setupEventListeners(): void {
        if (!this.socket) return;

        // Eventos de conexión
        this.socket.on('connect', () => {
            console.log('✅ Conectado al WebSocket - Socket ID:', this.socket?.id);
            this.connectionStatus$.next(true);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Desconectado del WebSocket');
            this.connectionStatus$.next(false);
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión WebSocket:', error);
            this.connectionStatus$.next(false);
        });

        // Eventos de donaciones
        this.socket.on('donation:created', (data: DonationResponse) => {
            console.log('🎁 [WebSocket] Nueva donación creada:', data);
            this.donationCreated$.next(data);
        });

        this.socket.on('donation:claimed', (data: DonationResponse) => {
            console.log('👋 [WebSocket] Donación reclamada:', data);
            this.donationClaimed$.next(data);
        });

        this.socket.on('donation:delivered', (data: DonationResponse) => {
            console.log('✅ [WebSocket] Donación entregada:', data);
            this.donationDelivered$.next(data);
        });

        // Eventos de notificaciones en tiempo real
        this.socket.on('notification:new', (data: NotificationResponse) => {
            console.log('🔔 [WebSocket] Nueva notificación:', data);
            this.notification$.next(data);
        });
    }

    /**
     * Desconectar del servidor WebSocket
     */
    disconnect(): void {
        if (this.socket) {
            console.log('🔌 Desconectando WebSocket...');
            this.socket.disconnect();
            this.socket = null;
            this.connectionStatus$.next(false);
        }
    }

    /**
     * Obtener el estado de conexión como Observable
     */
    getConnectionStatus(): Observable<boolean> {
        return this.connectionStatus$.asObservable();
    }

    /**
     * Escuchar eventos de donación creada
     */
    onDonationCreated(): Observable<DonationResponse | null> {
        return this.donationCreated$.asObservable();
    }

    /**
     * Escuchar eventos de donación reclamada
     */
    onDonationClaimed(): Observable<DonationResponse | null> {
        return this.donationClaimed$.asObservable();
    }

    /**
     * Escuchar eventos de donación entregada
     */
    onDonationDelivered(): Observable<DonationResponse | null> {
        return this.donationDelivered$.asObservable();
    }

    /**
     * Escuchar notificaciones en tiempo real
     */
    onNotification(): Observable<NotificationResponse | null> {
        return this.notification$.asObservable();
    }

    /**
     * Verificar si está conectado
     */
    isConnected(): boolean {
        return this.socket?.connected ?? false;
    }
}
