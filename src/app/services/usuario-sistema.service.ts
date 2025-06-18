import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import AuthService from '../auth/services/auth.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserSistemaData, UserSistemaGet } from '../page/usuario-sistema/models/usuario-sistema.model';
import { ApiResponse } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSistemaService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private urlBase = environment.apiGatewayUrl + '/usuarios/users-sistema';
  constructor() { }

  public getUserSistemas():Observable<UserSistemaGet[]>{
    return this.http
    .get<ApiResponse<UserSistemaGet[]>>(`${this.urlBase}`,{
      headers: this.authService.getAuthHeaders(),
    })
    .pipe(map((response)=> response.data));
  }

  public getUserSistemaByUserId(userId: number): Observable<UserSistemaData> {
    return this.http
    .get<ApiResponse<UserSistemaData>>(`${this.urlBase}/${userId}`,
      {headers: this.authService.getAuthHeaders(),}
    )
    .pipe(
      map((response)=>{
        if(response.status === 'success' && response.code === 200){
          return response.data;
        }else{
          throw new Error(`Error al obtener la data ${userId}: ${response.message}` || 'Error desconocido');
        }
      }),
      catchError((error:HttpErrorResponse)=>{
        console.error(`Error al obtener data ${userId}:`, error);
        let errorMessage= `No se pudieron cargar las asignaciones para el usuario ${userId}.`;
        if(error.error && error.error.message){
          errorMessage= error.error.message;
        }else if(error.message){
          errorMessage=error.message;
        }
        return throwError(()=> new Error(errorMessage));
      })
    );
  }
}
