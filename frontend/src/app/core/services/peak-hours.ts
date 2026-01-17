import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface CreatePeakHourDto {
    days: DayOfWeek[];
    startTime: string;  // Formato: "HH:MM"
    endTime: string;    // Formato: "HH:MM"
    note?: string;      // Máximo 100 caracteres
}

export interface PeakHourResponse {
    id: number;
    day: DayOfWeek[];
    startTime: string;
    endTime: string;
    note: string | null;
    locationId: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root',
})
export class PeakHoursService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/peak-hours';

    /**
     * Crear horarios pico (solo DONOR)
     */
    createPeakHours(peakHour: CreatePeakHourDto): Observable<ApiResponse<PeakHourResponse[]>> {
        return this.http.post<ApiResponse<PeakHourResponse[]>>(this.apiUrl, peakHour);
    }

    /**
     * Obtener horarios pico del donante actual
     */
    getPeakHours(): Observable<ApiResponse<PeakHourResponse[]>> {
        return this.http.get<ApiResponse<PeakHourResponse[]>>(this.apiUrl);
    }
}
