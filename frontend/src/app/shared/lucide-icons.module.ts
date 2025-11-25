import { NgModule } from '@angular/core';
import { LucideAngularModule, Info, Package, Search, Clock, Bell, MapPin, Plus, Calendar } from 'lucide-angular';

@NgModule({
  // Importa y configura los iconos aquí
  imports: [
    LucideAngularModule.pick({
      Info,
      Package,
      Search,
      Clock,
      Bell,
      MapPin,
      Plus,
      Calendar
    })
  ],
  exports: [
    LucideAngularModule
  ]
})
export class LucideIconsModule { }
