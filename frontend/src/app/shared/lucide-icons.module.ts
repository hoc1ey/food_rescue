import { NgModule } from '@angular/core';
import { LucideAngularModule, Info, Package, Search, Clock, Bell, MapPin, Plus, Calendar, Filter, AlertCircle, X, CheckCircle, AlertTriangle } from 'lucide-angular';

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
      Calendar,
      Filter,
      AlertCircle,
      X,
      CheckCircle,
      AlertTriangle
    })
  ],
  exports: [
    LucideAngularModule
  ]
})
export class LucideIconsModule { }
