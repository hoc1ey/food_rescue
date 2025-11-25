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
  // Re-exporta el módulo para que los componentes que lo importen puedan usar <lucide-icon>
  exports: [
    LucideAngularModule
  ]
})
export class LucideIconsModule { }