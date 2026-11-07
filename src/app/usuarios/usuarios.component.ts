import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  cargando = false;
  error = '';

  constructor(private usuarioService: UsuarioService) {}

  async ngOnInit(): Promise<void> {
    this.cargando = true;

    try {
      this.usuarios = await this.usuarioService.obtenerUsuarios();
    } catch (error) {
      this.error = 'No se pudieron cargar los usuarios.';
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }
}