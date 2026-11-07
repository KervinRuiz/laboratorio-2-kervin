import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';
import { ProductoRequest } from '../interfaces/ProductoRequest';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = 'http://localhost:8080/api/v1/productos';

  private getHeaders(): HeadersInit {
    const token = sessionStorage.getItem('access_token');

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token ?? ''}`
    };
  }

  async obtenerProductos(): Promise<Producto[]> {
    const respuesta = await fetch(this.url, {
      headers: this.getHeaders()
    });

    if (!respuesta.ok) {
      throw new Error(`Error al obtener productos: ${respuesta.status}`);
    }

    return await respuesta.json();
  }

  async obtenerProductoPorId(id: number): Promise<Producto> {
    const respuesta = await fetch(`${this.url}/${id}`, {
      headers: this.getHeaders()
    });

    if (!respuesta.ok) {
      throw new Error(`Error al obtener producto: ${respuesta.status}`);
    }

    return await respuesta.json();
  }

  async crearProducto(datos: ProductoRequest): Promise<Producto> {
    const respuesta = await fetch(`${this.url}/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`Error al crear producto: ${respuesta.status} - ${detalle}`);
    }

    return await respuesta.json();
  }

  async actualizarProducto(
    id: number,
    datos: ProductoRequest
  ): Promise<Producto> {
    const respuesta = await fetch(`${this.url}/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      throw new Error(`Error al actualizar producto: ${respuesta.status} - ${detalle}`);
    }

    return await respuesta.json();
  }

  async eliminarProducto(id: number): Promise<void> {
    const respuesta = await fetch(`${this.url}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!respuesta.ok) {
      throw new Error(`Error al eliminar producto: ${respuesta.status}`);
    }
  }
}
