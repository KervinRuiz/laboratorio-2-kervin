import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  menuAbierto = false;

  constructor(private router: Router) { }

  get usuario(): string {
    const token = sessionStorage.getItem('access_token');

    if (!token) {
      return 'Usuario';
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || 'Usuario';
    } catch (error) {
      return 'Usuario';
    }
  }

  get esAdministrador(): boolean {
    const token = sessionStorage.getItem('access_token');

    if (!token) return false;

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      );

      return payload.rol === 'SUPER-ADMIN-ROLE';
    } catch {
      return false;
    }
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
