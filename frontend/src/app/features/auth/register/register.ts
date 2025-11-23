import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { FormFieldComponent } from '../../../shared/ui/molecules/form-field/form-field';
import { TabGroupComponent } from '../../../shared/ui/molecules/tab-group/tab-group';

// Validador personalizado para confirmar la contraseña
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
    FormFieldComponent,
    TabGroupComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- Lógica de Tabs ---
  userRoles = ['Donante', 'Beneficiario'];
  activeRole: 'donor' | 'beneficiary' = 'donor';

  // --- Formulario Reactivo ---
  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator }); // Aplicamos el validador al grupo

  handleRoleChange(role: string) {
    this.activeRole = role === 'Donante' ? 'donor' : 'beneficiary';
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    // Por ahora, solo mostraremos los datos. El siguiente paso será enviarlos.
    console.log('Formulario válido. Datos a enviar:', {
      ...this.registerForm.value,
      userType: this.activeRole.toUpperCase() // DONOR o BENEFICIARY
    });
  }

  // --- Helper para errores ---
  getErrorMessage(controlName: string): string | null {
    const control = this.registerForm.get(controlName);
    if (!control || !control.touched) return null;

    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'El formato del email es incorrecto.';
    if (control.hasError('minlength')) return 'La contraseña debe tener al menos 8 caracteres.';
    
    // Error para el grupo de formulario
    if (controlName === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden.';
    }
    
    return null;
  }
}
