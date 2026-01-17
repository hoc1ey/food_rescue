import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../atoms/button/button';
import { FormFieldComponent } from '../form-field/form-field';
import { LucideIconsModule } from '../../../lucide-icons.module';

export interface NewDonationData {
  productName: string;
  quantity: number;
  unit: string;
}

@Component({
  selector: 'app-modal-new-donation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    LucideIconsModule
  ],
  templateUrl: './modal-new-donation.html',
  styleUrl: './modal-new-donation.css'
})
export class ModalNewDonationComponent {
  private fb = inject(FormBuilder);

  @Input() errorMessage: string | null = null;
  @Input() isLoading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<NewDonationData>();

  unitOptions = [
    { value: 'unidades', label: 'Unidades' },
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'litros', label: 'Litros' },
    { value: 'porciones', label: 'Porciones' },
    { value: 'cajas', label: 'Cajas' },
    { value: 'piezas', label: 'Piezas' }
  ];

  donationForm = this.fb.group({
    productName: ['', [Validators.required, Validators.maxLength(100)]],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    unit: ['unidades', Validators.required]
  });

  getErrorMessage(controlName: string): string | null {
    const control = this.donationForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['maxLength']) return 'Máximo 100 caracteres';
      if (control.errors['min']) return 'La cantidad debe ser al menos 1';
    }
    return null;
  }

  onClose() {
    this.donationForm.reset({
      productName: '',
      quantity: null,
      unit: 'unidades'
    });
    this.close.emit();
  }

  onSubmit() {
    if (!this.donationForm.valid) {
      this.donationForm.markAllAsTouched();
      return;
    }

    const formValue = this.donationForm.value;
    const donationData = {
      productName: formValue.productName!,
      quantity: formValue.quantity!,
      unit: formValue.unit!
    };

    console.log('📤 Enviando donación:', donationData);
    this.submit.emit(donationData);

    // Resetear el formulario después de enviar
    this.donationForm.reset({
      productName: '',
      quantity: null,
      unit: 'unidades'
    });
  }
}
