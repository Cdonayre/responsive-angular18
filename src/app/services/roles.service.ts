
import { inject, Injectable } from '@angular/core';
import AuthService from '../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable,map } from 'rxjs';
import { Rol, RolData } from '../page/roles/models/roles.model';
import { ApiResponse } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private authService = inject(AuthService);
  private http= inject(HttpClient);
  private urlBase = environment.apiGatewayUrl + '/usuarios/roles';


  constructor() { }

  public getRoles():Observable<RolData[]>{
    return this.http
    .get<ApiResponse<RolData[]>>(`${this.urlBase}`, {
      headers: this.authService.getAuthHeaders(),
    })
    .pipe(
      map((response: ApiResponse<RolData[]>)=>{
        if(response.status === 'success' && response.code){
          return response.data;
        }else {
          console.error('API error', response);
          throw new Error(`Error al cargar los roles ${response.status}`);
        }
      })
    );
  }

  public crearRoles(rol:Rol):Observable<RolData>{
    return this.http.post<ApiResponse<RolData>>(`${this.urlBase}`, rol, {
      headers: this.authService.getAuthHeaders(),
    })
    .pipe(
      map(response=>{
        if(response.status === 'success' && (response.code === 200 || response.code === 201)){
          return response.data;
        }else{
          throw new Error(`Error al crear el rol :${response.status}. Código${response.code}`);
        }
      })
    );
  }
  public actualizaRoles(id: number, rol: Rol):Observable<RolData>{
    return this.http.put<ApiResponse<RolData>>(`${this.urlBase}/${id}`, rol, {
      headers: this.authService.getAuthHeaders(),
    })
    .pipe(
      map(response=>{
        if(response.status === 'success' && (response.code === 200 || response.code === 201)){
          return response. data;
        }else {
          throw new Error(`Error al actualizar el id ${id}. ${response.status}. Código ${response.code}`);
        }
      })
    );
  }
  public eliminarRol(id:number):Observable<string>{
    return this.http.delete<ApiResponse<any>>(`${this.urlBase}/${id}`, {
      headers: this.authService.getAuthHeaders(),
    })
    .pipe(
      map(response=>{
        if (response.data === 'success' && response.code===200){
          return response.data;
        } else{
          throw new Error(`Error al eliminar el rol con id ${id}. ${response.data}`);
        }
      })
    );
  }
}
