import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ui/atoms/button/button';
import { FormFieldComponent } from '../../../shared/ui/molecules/form-field/form-field';
import { AuthService } from '../../../core/services/auth';
import { TabGroupComponent } from '../../../shared/ui/molecules/tab-group/tab-group';
import { Router, RouterModule } from '@angular/router'; // <-- 1. Importa RouterModule

@Component({
  selector: 'app-login',
  standalone: true,
  // Importamos nuestros átomos y moléculas
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    FormFieldComponent, 
    TabGroupComponent,
    RouterModule // <-- 2. Añádelo aquí
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // Usa CSS normal para layout específico
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- 1. Añade esta propiedad ---
  passwordVisible = false;

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

  // --- 2. Añade este método ---
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // --- 3. Lógica de redirección ---
    // Solución: Aseguramos que los valores no son nulos con el operador '!'
    const credentials = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        
        // Redirige según el rol activo
        if (this.activeRole === 'donor') {
          this.router.navigate(['/donor/dashboard']);
        } else {
          this.router.navigate(['/beneficiary/dashboard']);
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  userRoles = ['Donante', 'Beneficiario'];
  activeRole: 'donor' | 'beneficiary' = 'donor';

  handleRoleChange(role: string) {
    this.activeRole = role === 'Donante' ? 'donor' : 'beneficiary';
    console.log('Rol seleccionado:', this.activeRole);
    // Aquí puedes cambiar la lógica o el tema de la página si es necesario
  }
}