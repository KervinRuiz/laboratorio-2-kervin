import { Injectable } from '@angular/core';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:8080/api/v1/auth';

  async login(datos: LoginRequest): Promise<LoginResponse> {
    const respuesta = await fetch(`${this.url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      throw new Error(String(respuesta.status));
    }

    return await respuesta.json();
  }

  async registrar(datos: {
    username: string;
    password: string;
  }): Promise<void> {

    const respuesta = await fetch(`${this.url}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      throw new Error(String(respuesta.status));
    }
  }
}
