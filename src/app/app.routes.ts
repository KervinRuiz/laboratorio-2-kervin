import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuard, adminGuard } from './guards/auth.guard';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosComponent } from './productos/productos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RegistroComponent } from './registro/registro.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent, canActivate: [authGuard]},
    {path: 'categorias', component: CategoriasComponent, canActivate: [authGuard]},
    {path: 'productos',component: ProductosComponent, canActivate: [authGuard]},
    {path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard, adminGuard]},
    {path: 'registro', component: RegistroComponent},
    {path: '**', redirectTo: 'login'}
];
