
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, from } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username = '';
  password = '';
  mostrarPassword = false;
  cargando = false;
  mensaje = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async iniciarSesion(): Promise<void> {
    this.mensaje = '';

    if (!this.username.trim() || !this.password) {
      this.mensaje = 'Debes completar todos los campos.';
      return;
    }

    this.cargando = true;

    try {
      const respuesta = await this.authService.login({
        username: this.username.trim(),
        password: this.password
      });

      if (!respuesta.access_token) {
        this.mensaje = 'El servidor no devolvio un token JWT.';
        return;
      }

      sessionStorage.setItem(
        'access_token',
        respuesta.access_token
      );

      await this.router.navigate(['/home']);

    } catch (error) {
      if (error instanceof Error && error.message === '401') {
        this.mensaje = 'Usuario o password incorrectos.';
      } else {
        this.mensaje = 'No se pudo iniciar sesion.';
      }
    } finally {
      this.cargando = false;
    }
  }
}
