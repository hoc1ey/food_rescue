import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../../shared/ui/molecules/app-header/app-header';
import { NotificationBannerComponent } from '../../../shared/ui/molecules/notification-banner/notification-banner';
import { CardHeaderComponent } from '../../../shared/ui/molecules/card-header/card-header';

@Component({
  selector: 'app-beneficiary-dashboard',
  standalone: true,
  imports: [AppHeaderComponent, NotificationBannerComponent, CardHeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  private router = inject(Router);
  notificationCount = 1;

  handleLogout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}
