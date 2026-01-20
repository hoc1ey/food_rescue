import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { SoapRegistrationService } from '../../../core/services/soap-registration';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { FormFieldComponent } from '../../../shared/ui/molecules/form-field/form-field';
import { TabGroupComponent } from '../../../shared/ui/molecules/tab-group/tab-group';
import { User, Mail, Lock, MapPin, Home, Navigation } from 'lucide-angular';

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
  private soapService = inject(SoapRegistrationService);
  private router = inject(Router);

  // --- Iconos para la UI ---
  readonly icons = {
    user: User,
    mail: Mail,
    lock: Lock,
    mapPin: MapPin,
    home: Home,
    navigation: Navigation
  };

  // --- Lógica de Tabs ---
  userRoles = ['Donante', 'Beneficiario'];
  activeRole: 'donor' | 'beneficiary' = 'donor';
  currentStep = 1; // Controla en qué paso estamos

  // --- Formulario Reactivo ---
  registerForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    // Campos del Paso 2 (Ubicación)
    locationName: [''],
    locationMainStreet: [''],
    locationSecondaryStreet: [''],
    locationReference: [''],
    locationCityCode: ['UIO'] // Valor por defecto
  }, { validators: passwordMatchValidator }); // Aplicamos el validador al grupo

  handleRoleChange(role: string) {
    this.activeRole = role === 'Donante' ? 'donor' : 'beneficiary';
  }

  // Avanzar al paso 2 validando solo los campos del paso 1
  nextStep() {
    const step1Fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    let step1Valid = true;

    step1Fields.forEach(field => {
      const control = this.registerForm.get(field);
      if (control?.invalid) {
        control.markAsTouched();
        step1Valid = false;
      }
    });

    if (step1Valid) {
      this.currentStep = 2;
    }
  }

  prevStep() {
    this.currentStep = 1;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const datosRegistro = {
      ...this.registerForm.value,
      userType: this.activeRole.toUpperCase(), // DONOR o BENEFICIARY
    };

    console.log('Enviando datos a SOAP...', datosRegistro);

    this.soapService.registrarUsuario(datosRegistro).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor SOAP:', response);
        // Aquí podrías redirigir al login o mostrar un mensaje de éxito
        // this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en la petición SOAP:', error);
      }
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
