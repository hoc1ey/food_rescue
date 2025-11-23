import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../../shared/ui/molecules/app-header/app-header';
import { CardHeaderComponent } from '../../../shared/ui/molecules/card-header/card-header';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button'; 

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [AppHeaderComponent, CardHeaderComponent, ButtonComponent], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  private router = inject(Router);

  handleLogout() {
    console.log('Cerrando sesión...');
    // Aquí iría la lógica para limpiar el token de autenticación
    this.router.navigate(['/login']);
  }

  onNewDonation() {
    console.log('Navegando a la página de nueva donación...');
    // Aquí irá la lógica para navegar al formulario de donación
  }
}
