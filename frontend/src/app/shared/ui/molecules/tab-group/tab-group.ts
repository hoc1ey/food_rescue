import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-group.html',
  styleUrls: ['./tab-group.css']
})
export class TabGroupComponent {
  // Recibe los nombres de los tabs, ej: ['Donante', 'Beneficiario']
  @Input() tabs: string[] = [];
  
  // Recibe el tema actual para aplicar los colores correctos
  @Input() theme: 'donor' | 'beneficiary' = 'donor';

  // Notifica al padre cuando un tab cambia
  @Output() tabChange = new EventEmitter<string>();

  activeTab!: string;

  ngOnInit() {
    // Activa el primer tab por defecto
    if (this.tabs.length > 0) {
      this.activeTab = this.tabs[0];
    }
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }
}
