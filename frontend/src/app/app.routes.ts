import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { DashboardComponent as DonorDashboardComponent } from './features/donor/dashboard/dashboard';
import { DashboardComponent as BeneficiaryDashboardComponent } from './features/beneficiary/dashboard/dashboard';
import { RegisterComponent } from './features/auth/register/register';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Registro' },
  { path: 'donor/dashboard', component: DonorDashboardComponent, title: 'Dashboard Donante' },
  { path: 'beneficiary/dashboard', component: BeneficiaryDashboardComponent, title: 'Dashboard Beneficiario' },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];