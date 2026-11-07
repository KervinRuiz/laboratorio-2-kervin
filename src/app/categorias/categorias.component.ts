import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Categoria } from '../interfaces/categoria';
import { CategoriaService } from '../services/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent {
  categorias: Categoria[] = [];
  busqueda = '';
  cargando = false;
  guardando = false;
  mensaje = '';
  error = '';

  mostrarFormulario = false;
  categoriaEditando: number | null = null;

  formulario = {
    nombre: '',
    descripcion: ''
  };

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  get esAdministrador(): boolean {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.rol === 'SUPER-ADMIN-ROLE';
    } catch (error) {
      return false;
    }
  }
  get categoriasFiltradas(): Categoria[] {
    const texto = this.busqueda.toLowerCase().trim();
    return this.categorias.filter(categoria =>
      categoria.nombre.toLowerCase().includes(texto) ||
      (categoria.descripcion ?? '').toLowerCase().includes(texto)
    );
  }
  async cargarCategorias() {
    this.cargando = true;
    this.error = '';
    try {
      this.categorias = await this.categoriaService.obtenerCategorias();
    } catch (error) {
      this.error = 'Error al cargar las categorías';
    } finally {
      this.cargando = false;
    }
  }
  async nuevaCategoria() {
    if (!this.esAdministrador) return;
    this.mostrarFormulario = true;
    this.categoriaEditando = null;
    this.formulario = {
      nombre: '',
      descripcion: ''
    };
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }
  async editarCategoria(categoria: Categoria) {
    if (!this.esAdministrador) return;
    this.categoriaEditando = categoria.id;
    this.formulario = {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || ''
    };
    this.mostrarFormulario = true;
    this.error = '';
    this.mensaje = '';
  }
  cancelar(): void {
    this.mostrarFormulario = false;
    this.categoriaEditando = null;
  }

  async guardarCategoria(): Promise<void> {
    if (!this.esAdministrador || this.guardando) return;

    const nombre = this.formulario.nombre?.trim() ?? '';
    const descripcion = this.formulario.descripcion?.trim() ?? '';

    if (!nombre || !descripcion) {
      this.error = 'El nombre y la descripción son obligatorios.';
      return;
    }

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    const datos = {
      nombre: nombre,
      descripcion: descripcion
    };

    try {
      if (this.categoriaEditando !== null) {
        await this.categoriaService.actualizarCategoria(
          this.categoriaEditando,
          datos
        );

        this.mensaje = 'Categoría actualizada correctamente.';
      } else {
        await this.categoriaService.crearCategoria(datos);
        this.mensaje = 'Categoría creada correctamente.';
      }

      this.cancelar();
      await this.cargarCategorias();

    } catch (error) {
      this.error = 'No se pudo guardar la categoría.';
      console.error(error);
    } finally {
      this.guardando = false;
    }
  }
  async eliminarCategoria(categoria: Categoria) {
    if (!this.esAdministrador) return;
    const confirmar = confirm(`¿Está seguro de que desea eliminar esta categoría? "${categoria.nombre}"`);

    if (!confirmar) return;

    this.error = '';
    this.mensaje = '';

    try {
      await this.categoriaService.eliminarCategoria(categoria.id);
      this.mensaje = 'Categoría eliminada correctamente';
      await this.cargarCategorias();
    } catch (error) {
      this.error = 'Error al eliminar la categoría';
    }
  }
}
