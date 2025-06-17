import { inject, Injectable } from '@angular/core';
import AuthService from '../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, takeUntil } from 'rxjs';
import { Sistemas } from '../page/sistemas/models/sistemas.model';
import { ApiResponse } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SistemasService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private urlBase = environment.apiGatewayUrl + '/usuarios/sistemas';

  constructor() {}

  public getSistemas(): Observable<Sistemas[]> {
    return this.http
      .get<ApiResponse<Sistemas[]>>(`${this.urlBase}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response: ApiResponse<Sistemas[]>) => {
          if (response.status === 'success' && response.code) {
            return response.data;
          } else {
            console.error('API error', response);
            throw new Error(`Error al cargar los roles ${response.status}`);
          }
        })
      );
  }

  public getSistemasById(id: number): Observable<Sistemas[]> {
    return this.http
      .get<ApiResponse<Sistemas[]>>(`${this.urlBase}/${id}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response: ApiResponse<Sistemas[]>) => {
          if (response.status === 'success' && response.code) {
            return response.data;
          } else {
            console.error('API error', response);
            throw new Error(`Error al cargar los roles ${response.status}`);
          }
        })
      );
  }

  public crearSistema(sistema: Omit<Sistemas, 'id'>): Observable<Sistemas> {
    return this.http
      .post<ApiResponse<Sistemas>>(`${this.urlBase}`, sistema, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.status === 'success' && response.code === 201) {
            return response.data;
          } else {
            throw new Error(
              `Error al crear: ${response.status}. Código ${response.code}`
            );
          }
        })
      );
  }

  public actualizarSistema(
    id: number,
    sistema: Sistemas
  ): Observable<Sistemas> {
    return this.http
      .put<ApiResponse<Sistemas>>(`${this.urlBase}/${id}`, sistema, {
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
            throw new Error(
              `Error al actualizar ${id}. ${response.status}. Código ${response.code}`
            );
          }
        })
      );
  }

  public eliminarSistema(id:number):Observable<string>{
    console.log(`${this.urlBase}/${id}`);
    return this.http.delete<ApiResponse<any>>(`${this.urlBase}/${id}`,{
      headers:this.authService.getAuthHeaders(),
    })
    .pipe(
      map((response:any)=>{
        if(response.status === 'success' && response.code===200){
          return response.message;
        }else{
          throw new Error(`Error al eliminar el id ${id}. ${response.message}`);
        }
      })
    );
  }
}
