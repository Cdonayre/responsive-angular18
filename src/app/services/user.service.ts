import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
    private http=inject(HttpClient);
    private urlBase = environment.apiUserUrl + '/users';

  
    getToken(){
      return localStorage.getItem('authUser');
    }
    private getHttpOptions(){
      const token = this.getToken();
      return{
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: token? `Bearer ${token}`:''
              })
      };
    }

    public getUsuariosSistemas():Observable<UsuarioSistemas[]>{
      return this.http.get<UsuarioSistemas[]>(`${this.urlBase}/sistemas/${1}`, this.getHttpOptions());
    }

    // public getUsuariosPaginado(page:number, limit:number):Observable<PaginatedUserResponse>{
    //   const paginacionURL = `${environment.apiUserUrl}/users/${page}/${limit}`;
    //   return this.http.get<PaginatedUserResponse>(paginacionURL, this.getHttpOptions());
    // }

    public postUsuario(usuario:UsuarioCrear):Observable<UsuarioCrear>{
      return this.http.post<UsuarioCrear>(this.urlBase, usuario, this.getHttpOptions());
    }

    public putUsuario(usuario:UsuarioCrear):Observable<UsuarioCrear>{
      return this.http.put<UsuarioCrear>(`${this.urlBase}/${usuario.id}`, usuario, this.getHttpOptions());
    }

    public deleteUSer(id:number):Observable<any>{
      return this.http.delete<any>(`${this.urlBase}/${id}`, this.getHttpOptions());
    }
}

export interface Usuarios {
  id:         number;
  nombre:     string;
  apellido:   string;
  correo:     string;
  estado:     boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UsuarioSistemas{
  dni:            string;
  id_usuario:     number;
  correo:         string;
  nombre:         string;
  apellido:       string;
  nombre_usuario: string;
  id_sistema:     number; 
  nombre_sistema: string;
  id_rol:         number;
  nombre_rol:     string;
}

export interface PaginatedUserResponse{
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  users:Usuarios[];

  id:                 number;
  dni:                string;
  nombre:             string;
  apellido:           string;
  nombre_usuario:     string;
  correo:             string;
  clave_hash:         string;
  estado:             boolean;
  establecimiento_id: null;
  fecha_vencimiento:  null;
  created_at:         Date;
  updated_at:         Date;
}

export interface UsuarioCrear {
  id?:             number;
  dni:            string;
  nombre:         string;
  apellido:       string;
  nombre_usuario: string;
  correo:         string;
  clave?:          string;
}
