import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

// Interfaces para tipar las peticiones y respuestas
export interface CreateDonationDto {
    productName: string;
    quantity: number;
    unit: string;
}

export interface DonationResponse {
    id: string;
    productName: string;
    quantity: number;
    unit: string;
    status: 'AVAILABLE' | 'ASSIGNED' | 'DELIVERED';
    donorId: number; // SQL: integer -> TS: number
    beneficiaryId: string | null;
    donorConfirmed: boolean;      // Faltaba este campo de la BD
    beneficiaryConfirmed: boolean; // Faltaba este campo de la BD
    createdAt: string;
    updatedAt: string;
    location?: {
        id: number;
        name: string;
        mainStreet: string;
        secondaryStreet: string;
        reference: string;
        cityCode: string;
        city: {
            code: string;
            name: string;
        };
    };
    donor?: {
        id: number; // SQL: integer -> TS: number
        user: {
            firstName: string;
            lastName: string;
        };
    };
    beneficiary?: {
        firstName: string;
        lastName: string;
        email: string;
    } | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root',
})
export class DonationsService {
    private http = inject(HttpClient);
    private platformId = inject(PLATFORM_ID);
    private apiUrl = 'http://localhost:3000/api/donations';

    /**
     * Crear una nueva donación (solo DONOR)
     */
    createDonation(donation: CreateDonationDto): Observable<ApiResponse<DonationResponse>> {
        return this.http.post<ApiResponse<DonationResponse>>(this.apiUrl, donation);
    }

    /**
     * Obtener donaciones
     * - Para DONOR: retorna todas sus donaciones
     * - Para BENEFICIARY: retorna donaciones disponibles
     */
    getDonations(): Observable<ApiResponse<DonationResponse[]>> {
        if (!isPlatformBrowser(this.platformId)) {
            return of({ success: true, message: 'SSR skipped', data: [] });
        }
        return this.http.get<ApiResponse<DonationResponse[]>>(this.apiUrl);
    }

    /**
     * Reclamar una donación (solo BENEFICIARY)
     */
    claimDonation(donationId: string): Observable<ApiResponse<DonationResponse>> {
        return this.http.post<ApiResponse<DonationResponse>>(`${this.apiUrl}/${donationId}/claim`, {});
    }

    /**
     * Confirmar entrega de una donación
     */
    confirmDonation(donationId: string): Observable<ApiResponse<DonationResponse>> {
        return this.http.post<ApiResponse<DonationResponse>>(`${this.apiUrl}/${donationId}/confirm`, {});
    }
}
