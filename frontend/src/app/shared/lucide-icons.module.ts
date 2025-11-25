import { NgModule } from '@angular/core';
import {
  LucideAngularModule,
  Info,
  Package,
  Search,
  Clock,
  Bell,
  Plus,
  Calendar,
  Building,
  MapPin
} from 'lucide-angular';

@NgModule({
  // Importa y configura los iconos aquí
  imports: [
    LucideAngularModule.pick({
      Info,
      Package,
      Search,
      Clock,
      Bell,
      Plus,
      Calendar,
      Building,
      MapPin
    })
  ],
  exports: [
    LucideAngularModule
  ]
})
export class LucideIconsModule { }
