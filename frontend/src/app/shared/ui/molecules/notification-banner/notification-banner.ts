import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '../../../lucide-icons.module';

@Component({
  selector: 'app-notification-banner',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './notification-banner.html',
  styleUrl: './notification-banner.css'
})
export class NotificationBannerComponent {
  @Input() notificationCount: number = 0;
  @Input() theme: 'donor' | 'beneficiary' = 'beneficiary';
}
