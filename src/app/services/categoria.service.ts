import { Injectable } from '@angular/core';
import { Categoria } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private url = 'http://localhost:8080/api/v1/categorias';

  private getHeaders(): HeadersInit {
    const token = sessionStorage.getItem('access_token');

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token ?? ''}`
    };
  }

  async obtenerCategorias(): Promise<any> {
    const respuesta = await fetch(this.url, {
      headers: this.getHeaders()
    });
    if (!respuesta.ok) {
      throw new Error('Error al obtener las categorias');
    }
    return respuesta.json();
  }
  //Metodo de obtener categoria por id
  async obtenerCategoriasId(id: number): Promise<any> {
    const respuesta = await fetch(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });
    if (!respuesta.ok) {
      throw new Error('Error al obtener las categorias');
    }
    return respuesta.json();
  }
  //Metodo de crear categoria
  async crearCategoria(datos: Omit<Categoria, 'id'>): Promise<Categoria> {
    const respuesta = await fetch(`${this.url}/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      throw new Error(`Error al crear categoría: ${respuesta.status}`);
    }

    return await respuesta.json();
  }
  async actualizarCategoria(id: number, datos: Omit<any, 'id'>): Promise<any> {
    const respuesta = await fetch(`${this.url}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(datos)
    });
    if (!respuesta.ok) {
      throw new Error('Error al actualizar la categoria');
    }
    return respuesta.json();
  }
  async eliminarCategoria(id: number): Promise<void> {
    const respuesta = await fetch(`${this.url}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!respuesta.ok) {
      throw new Error('Error al eliminar la categoria');
    }
  }
}
