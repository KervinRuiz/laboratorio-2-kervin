import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  username = '';
  password = '';
  confirmarPassword = '';

  cargando = false;
  error = '';
  mensaje = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async registrar(): Promise<void> {
    if (this.cargando) return;

    this.error = '';
    this.mensaje = '';

    const username = this.username.trim();

    if (!username || !this.password) {
      this.error = 'Completa todos los campos.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;

    try {
      await this.authService.registrar({
        username,
        password: this.password
      });

      this.mensaje = 'Cuenta creada correctamente. Ya puedes iniciar sesión.';
      this.password = '';
      this.confirmarPassword = '';

    } catch (error) {
      if (error instanceof Error && error.message.includes('409')) {
        this.error = 'El nombre de usuario ya está registrado.';
      } else {
        this.error = 'No se pudo crear la cuenta.';
      }
      console.error(error);

    } finally {
      this.cargando = false;
    }
  }
}
