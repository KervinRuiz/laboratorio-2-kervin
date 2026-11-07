import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Producto } from '../interfaces/producto';
import { Categoria } from '../interfaces/categoria';
import { ProductoService } from '../services/producto.service';
import { CategoriaService } from '../services/categoria.service';
import { ProductoRequest } from '../interfaces/ProductoRequest';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  categorias: Categoria[] = [];

  busqueda = '';
  cargando = false;
  guardando = false;
  mensaje = '';
  error = '';

  mostrarFormulario = false;
  productoEditando: number | null = null;

  formulario = {
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad: 0,
    categoriaId: 0
  };

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
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

  get productosFiltrados(): Producto[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(texto) ||
      (producto.descripcion ?? '').toLowerCase().includes(texto) ||
      (producto.categoria?.nombre ?? '').toLowerCase().includes(texto)
    );
  }

  get valorInventario(): number {
    return this.productos.reduce(
      (total, producto) =>
        total + producto.precio * producto.cantidad,
      0
    );
  }

  async cargarDatos(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      const [productos, categorias] = await Promise.all([
        this.productoService.obtenerProductos(),
        this.categoriaService.obtenerCategorias()
      ]);

      this.productos = productos;
      this.categorias = categorias;

    } catch (error) {
      this.error = 'No se pudieron cargar los productos.';
      console.error(error);
    } finally {
      this.cargando = false;
    }
  }

  nuevoProducto(): void {
    if (!this.esAdministrador) return;

    this.productoEditando = null;

    this.formulario = {
      nombre: '',
      descripcion: '',
      precio: 0,
      cantidad: 0,
      categoriaId: 0
    };

    this.mensaje = '';
    this.error = '';
    this.mostrarFormulario = true;
  }

  editarProducto(producto: Producto): void {
    if (!this.esAdministrador) return;

    this.productoEditando = producto.id;

    this.formulario = {
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
      cantidad: producto.cantidad,
      categoriaId: producto.categoria?.id ?? 0
    };

    this.mensaje = '';
    this.error = '';
    this.mostrarFormulario = true;
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.productoEditando = null;
  }


  async guardarProducto(): Promise<void> {
    if (!this.esAdministrador || this.guardando) return;

    const nombre = this.formulario.nombre.trim();
    const descripcion = this.formulario.descripcion.trim();
    const precio = Number(this.formulario.precio);
    const cantidad = Number(this.formulario.cantidad);
    const categoriaId = Number(this.formulario.categoriaId);

    if (!nombre || !descripcion) {
      this.error = 'El nombre y la descripción son obligatorios.';
      return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
      this.error = 'El precio debe ser mayor que cero.';
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad < 0) {
      this.error = 'La cantidad debe ser un número entero mayor o igual a cero.';
      return;
    }

    if (!this.categorias.some(categoria => categoria.id === categoriaId)) {
      this.error = 'Debes seleccionar una categoría válida.';
      return;
    }

    const datos: ProductoRequest = {
      nombre,
      descripcion,
      precio,
      cantidad,
      categoriaId
    };

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    try {
      if (this.productoEditando !== null) {
        await this.productoService.actualizarProducto(
          this.productoEditando,
          datos
        );

        this.mensaje = 'Producto actualizado correctamente.';
      } else {
        await this.productoService.crearProducto(datos);

        this.mensaje = 'Producto creado correctamente.';
      }

      this.cancelar();
      await this.cargarDatos();

    } catch (error) {
      this.error = error instanceof Error
        ? error.message
        : 'No se pudo guardar el producto.';

      console.error(error);
    } finally {
      this.guardando = false;
    }
  }


  async eliminarProducto(producto: Producto): Promise<void> {
    if (!this.esAdministrador) return;

    const confirmar = confirm(
      `¿Deseas eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) return;

    this.error = '';
    this.mensaje = '';

    try {
      await this.productoService.eliminarProducto(producto.id);
      this.mensaje = 'Producto eliminado correctamente.';
      await this.cargarDatos();

    } catch (error) {
      this.error = 'No se pudo eliminar el producto.';
      console.error(error);
    }
  }
}
