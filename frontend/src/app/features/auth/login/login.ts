import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { FormFieldComponent } from '../../../shared/ui/molecules/form-field/form-field';
import { AuthService } from '../../../core/services/auth';
import { TabGroupComponent } from '../../../shared/ui/molecules/tab-group/tab-group';

@Component({
  selector: 'app-login',
  standalone: true,
  // Importamos nuestros átomos y moléculas
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, FormFieldComponent, TabGroupComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // Usa CSS normal para layout específico
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Helper para obtener errores limpios en el HTML
  getErrorMessage(controlName: string): string | null {
    const control = this.loginForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Este campo es obligatorio';
      if (control.errors['email']) return 'Email inválido';
      if (control.errors['minlength']) return 'Mínimo 6 caracteres';
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Lógica de envío...
      console.log(this.loginForm.value);
    } else {
        this.loginForm.markAllAsTouched();
    }
  }

  userRoles = ['Donante', 'Beneficiario'];
  activeRole: 'donor' | 'beneficiary' = 'donor';

  handleRoleChange(role: string) {
    this.activeRole = role === 'Donante' ? 'donor' : 'beneficiary';
    console.log('Rol seleccionado:', this.activeRole);
    // Aquí puedes cambiar la lógica o el tema de la página si es necesario
  }
}