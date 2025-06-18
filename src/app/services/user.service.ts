import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';
import AuthService from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private authService: AuthService) {}
  private http = inject(HttpClient);
  private urlBase = environment.apiGatewayUrl + '/usuarios/users';

  public getUsuariosSistemas(tipoRol: number): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.urlBase}/sistemas/${tipoRol}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response: ApiResponse<User[]>) => {
          if (response.status === 'success' && response.code === 200) {
            return response.data;
          } else {
            console.error('API error', response);
            throw new Error(`Error al cargar los usuarios ${response.status}`);
          }
        })
      );
  }

  getListaUsuarios2(): Observable<UsuariosData[]> {
    // Assuming this endpoint returns a BackendApiResponse with data: UsuariosData[]
    return this.http
      .get<ApiResponse<UsuariosData[]>>(`${this.urlBase}`, {
        headers: this.authService.getAuthHeaders(),
      }) // Adjust endpoint
      .pipe(map((response) => response.data)); // Extract the data array
  }

  getUsuarioById(id_usuario: number): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.urlBase}/${id_usuario}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(map((response) => response.data));
  }

  public getListaUsuarios(): Observable<UsuariosData[]> {
    return this.http
      .get<ApiResponse<UsuariosData[]>>(`${this.urlBase}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.status === 'success' && response.code === 200) {
            return response.data;
          } else {
            throw new Error(
              `Error al obtener datos ${response.status}. Código ${response.code}`
            );
          }
        })
      );
  }

  public postUsuario(usuario: UsuarioCrear): Observable<UsuarioCrear> {
    return this.http
      .post<ApiResponse<UsuarioCrear>>(this.urlBase, usuario, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          if (
            response.status === 'success' &&
            (response.code === 200 || response.code === 201)
          ) {
            return response.data;
          } else {
            console.error('Error en el API:', response);
            throw new Error(`Error al crear el usuario: ${response.status}`);
          }
        }),
        catchError((error) => {
          console.error('Error fetching usuarios ', error);
          return throwError(() => error);
        })
      );
  }

  public putUsuario(id: number, usuario: UsuarioUpdate): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.urlBase}/${id}`, usuario, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response: ApiResponse<User>) => {
          if (response.status === 'success' && response.code === 200) {
            return response.data;
          } else {
            console.error('API error al actualizar usuario:', response);
            throw new Error(
              `Error al actualizar usuario: ${
                response.message || 'Respuesta inesperada del API'
              }`
            );
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error al actualizar usuario: ', error);
          let customErrorMessage = 'Error inesperado al actualizar el usuario.';
          if (
            error.error &&
            typeof error.error === 'object' &&
            'message' in error.error
          ) {
            customErrorMessage = `Error ${error.status}: ${
              error.statusText || 'Error desconocido'
            }`;
          } else if (error.status) {
            customErrorMessage = `Error ${error.status}: ${
              error.statusText || 'Error desconocido'
            }`;
          } else if (error.message) {
            customErrorMessage = error.message;
          }
          return throwError(() => Error(customErrorMessage));
        })
      );
  }

  public deleteUSer(id: number): Observable<DeleteResponse> {
    return this.http
      .delete<DeleteResponse>(`${this.urlBase}/${id}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(`Error al eliminar el usuario con id: ${id}`, error);
          let customErrorMessage = 'Error inesperado al eliminar el usuario.';

          if (error.status === 404) {
            customErrorMessage =
              error.error?.message ||
              `El usuario con id ${id} no ha sido encontrado.`;
          } else if (error.status === 401) {
            customErrorMessage =
              error.error?.message || 'Token inválido o ausente.';
          } else if (error.status === 500) {
            customErrorMessage =
              error.error?.message ||
              'Error del servidor al eliminar el usuario.';
          } else if (error.message) {
            customErrorMessage = error.message;
          }
          return throwError(() => new Error(customErrorMessage));
        })
      );
  }
}

export interface Usuarios {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  estado: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UsuarioSistemas {
  dni: string;
  id: number;
  correo: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  id_sistema: number;
  nombre_sistema: string;
  id_rol: number;
  nombre_rol: string;
}

export interface PaginatedUserResponse {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  users: Usuarios[];

  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  correo: string;
  clave_hash: string;
  estado: boolean;
  establecimiento_id: null;
  fecha_vencimiento: null;
  created_at: Date;
  updated_at: Date;
}

export interface UsuarioCrear {
  dni: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  correo: string;
  clave: string;
  sistema_id?: number;
}

export interface Roles {
  id: number | null;
  descripcion: string;
}

export interface User {
  id: number;
  dni: string;
  correo: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  id_sistema: number;
  nombre_sistema: string;
  id_rol: number;
  nombre_rol: string;
  clave?: string;
}

export interface UsuarioUpdate {
  dni: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  correo: string;
  clave?: string;
}
export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

export interface DeleteResponse {
  message: string;
}

export interface UsuariosLista {
  status: string;
  code: number;
  message: string;
  data: UsuariosData[];
}

export interface UsuariosData {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  estado: boolean;
  created_at: Date;
  updated_at: Date;
}
