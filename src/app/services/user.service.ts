import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import AuthService from '../auth/services/auth.service';
import { getUserHeaders } from '../helper/auth.utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private authService: AuthService) {}
  private http = inject(HttpClient);
  private urlBase = environment.apiUserUrl + '/users';


  getToken() {
    return localStorage.getItem('authentication_value');
  }
  // private getHttpOptions() {
  //   const token = this.getToken();
  //   return {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: token ? `Bearer ${token}` : '',
  //     }),
  //   };
  // }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // <-- This will now return the correct token string
    if (!token) {
      console.warn(
        'No authentication token found. Redirecting to login or handling.'
      );
      return new HttpHeaders({ 'Content-Type': 'application/json' }); // Return headers without auth
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  public getUsuariosSistemas(tipoRol:number): Observable<UsuarioSistemas[]> {
    return this.http.get<UsuarioSistemas[]>(`${this.urlBase}/sistemas/${tipoRol}`, { headers: this.getAuthHeaders() })
    .pipe(
      catchError(error=>{
        console.error('Error fetching usuarios ',error);
        return throwError(()=>error);
      })
    );
  }

  public postUsuario(usuario: UsuarioCrear): Observable<UsuarioCrear> {
    return this.http.post<UsuarioCrear>(
      this.urlBase,
      usuario,{ headers: this.getAuthHeaders() })
    .pipe(
      catchError(error=>{
        console.error('Error fetching usuarios ',error);
        return throwError(()=>error);
      })
    );
  }

  public putUsuario(usuario: UsuarioCrear): Observable<UsuarioCrear> {
    return this.http.put<UsuarioCrear>(
      `${this.urlBase}/${usuario.id}`,
      usuario,
      { headers: this.getAuthHeaders() })
    .pipe(
      catchError(error=>{
        console.error('Error fetching usuarios ',error);
        return throwError(()=>error);
      })
    );
  }

  public deleteUSer(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.urlBase}/${id}`,{ headers: this.getAuthHeaders() })
    .pipe(
      catchError(error=>{
        console.error('Error fetching usuarios ',error);
        return throwError(()=>error);
      })
    );
  }
  // public getUsuariosPaginado(page:number, limit:number):Observable<PaginatedUserResponse>{
  //   const paginacionURL = `${environment.apiUserUrl}/users/${page}/${limit}`;
  //   return this.http.get<PaginatedUserResponse>(paginacionURL, this.getHttpOptions());
  // }
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
  clave?: string;
}


export interface Roles{
  id: number;
  descripcion: string;
}