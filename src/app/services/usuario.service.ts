import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost:8080/api/v1/usuarios';

  async obtenerUsuarios(): Promise<Usuario[]> {
    const token = sessionStorage.getItem('access_token');

    const respuesta = await fetch(this.url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error al obtener usuarios: ${respuesta.status}`);
    }

    return await respuesta.json();
  }
}