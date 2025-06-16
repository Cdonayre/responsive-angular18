import { HttpClient, HttpHeaders } from '@angular/common/http';
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
          if (response.status === 'success' && response.code === 200) {
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
      .put<User>(`${this.urlBase}/${id}`, usuario, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response: User | ApiResponse<User>) => {
          if (
            'status' in response &&
            response.status === 'success' &&
            response.code === 200
          ) {
            return response.data;
          } else if ('id_usuario' in response) {
            return response;
          } else {
            console.error(
              'REspuesta inesperada del API para actualizar: ',
              response
            );
            throw new Error(`Error al actualizar usuario: ${response}`);
          }
        }),
        catchError((error) => {
          console.error('Error fetching usuarios ', error);
          return throwError(() => error);
        })
      );
  }

  public deleteUSer(id: number): Observable<DeleteResponse> {
    return this.http
      .delete<DeleteResponse>(`${this.urlBase}${id}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error(`Error al eliminar el usuario con id: ${id}`, error);
          if (error.status === 404) {
            return throwError(
              () => new Error(`El usuario con id ${id} no ha sido encontrado`)
            );
          } else if (error.status === 401) {
            return throwError(() => new Error('Token inválido, o ausente'));
          }
          return throwError(
            () => new Error('Error inesperado al eliminar el usuario')
          );
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
  id_usuario: number;
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
  id?: number;
  dni: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  correo: string;
  clave: string;
  sistema_id: number;
}

export interface Roles {
  id: number;
  descripcion: string;
}

export interface User {
  dni: string;
  id_usuario: number;
  correo: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  id_sistema: number;
  nombre_sistema: string;
  id_rol: number;
  nombre_rol: string;
}

export interface UsuarioUpdate {
  dni?: string;
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  correo: string;
  clave?: string;
}
export interface ApiResponse<T> {
  status: string;
  code: number;
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
