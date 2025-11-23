import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService { // Es buena práctica llamarlo AuthService
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth'; // URL de tu backend

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}