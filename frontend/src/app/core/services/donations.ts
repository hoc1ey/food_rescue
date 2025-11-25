import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    donorId: string;
    beneficiaryId: string | null;
    createdAt: string;
    updatedAt: string;
    donor?: {
        id: string;
        name: string;
        address: string;
    };
    beneficiary?: {
        id: string;
        name: string;
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
