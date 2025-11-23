import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login'; // Ajusta la ruta si es necesario

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Redirigir al login por defecto
];