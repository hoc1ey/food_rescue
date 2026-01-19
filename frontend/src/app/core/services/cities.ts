import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CityResponse {
    code: string;
    name: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root',
})
export class CitiesService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/cities';

    /**
     * Obtener todas las ciudades disponibles
     * No requiere autenticación
     */
    getCities(): Observable<ApiResponse<CityResponse[]>> {
        return this.http.get<ApiResponse<CityResponse[]>>(this.apiUrl);
    }
}
