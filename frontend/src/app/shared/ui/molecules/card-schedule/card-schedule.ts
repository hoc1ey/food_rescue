import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardHeaderComponent } from '../card-header/card-header';
import { LucideIconsModule } from '../../../lucide-icons.module';

export interface ScheduleData {
  days: string;
  preferredTime: string;
  notes: string;
}

@Component({
  selector: 'app-card-schedule',
  standalone: true,
  imports: [CommonModule, CardHeaderComponent, LucideIconsModule],
  templateUrl: './card-schedule.html',
  styleUrl: './card-schedule.css'
})
export class CardScheduleComponent {
  @Input() scheduleData!: ScheduleData;
  @Input() theme: 'donor' | 'beneficiary' = 'donor';
}
