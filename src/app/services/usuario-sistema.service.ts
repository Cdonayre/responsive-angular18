import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import AuthService from '../auth/services/auth.service';
import {
  catchError,
  map,
  Observable,
  ObservedValueOf,
  of,
  throwError,
} from 'rxjs';
import {
  UserSistemaData,
  UserSistemaDelete,
  UserSistemaGet,
  UserSistemaPost,
} from '../page/usuario-sistema/models/usuario-sistema.model';
import { ApiResponse } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioSistemaService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private urlBase = environment.apiGatewayUrl + '/usuarios/user-sistema';
  constructor() {}

  public getUserSistemas(): Observable<UserSistemaGet[]> {
    return this.http
      .get<ApiResponse<UserSistemaGet[]>>(`${this.urlBase}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(map((response) => response.data));
  }

  public getUserSistemaByUserId(userId: number): Observable<UserSistemaData> {
    return this.http
      .get<any>(`${this.urlBase}/${userId}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.status === 'success' && response.code === 200) {
            return response.data as UserSistemaData;
          } else {
            throw new Error(
              `Error API: ${response.message || 'Respuesta inesperada'}`
            );
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(
            `Error al obtener asignaciones para el usuario ${userId}:`,
            error
          );

          // If the error is a 404 (Not Found), it means no assignments exist for this user.
          // In this case, we want to return a UserSistemaData object with an empty assignments array.
          if (error.status === 404) {
            console.log(
              `Usuario ${userId} no tiene asignaciones (404), devolviendo datos vacíos.`
            );
            // Return an Observable of a UserSistemaData object with empty assignments
            return of({
              usuario_id: userId,
              nombre_usuario: 'Usuario Desconocido', // You might not have the name here, so use a placeholder
              asignaciones: [], // This is the crucial part: an empty array
            } as UserSistemaData);
          } else {
            // Handle authentication/authorization errors separately if needed
            let errorMessage = `Error ${error.status} al cargar asignaciones: ${error.message}`;
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            }
            return throwError(() => new Error(errorMessage));
          }
        })
      );
  }

  public postUserSistema(
    usuarioSistemaPost: UserSistemaPost
  ): Observable<UserSistemaPost> {
    return this.http
      .post<ApiResponse<UserSistemaPost>>(
        `${this.urlBase}`,
        usuarioSistemaPost,
        {
          headers: this.authService.getAuthHeaders(),
        }
      )
      .pipe(
        map((response) => {
          if (response.status === 'success' && response.code === 201) {
            return response.data;
          } else if (response.code === 400 || response.code === 409) {
            throw new Error(
              `Error ${response.code}: ${
                response.message || 'Error desconocido'
              }`
            );
          } else {
            throw new Error(
              `Respuesta inesperada de la API: Estado=${response.status}, Código=${response.code}, Mensaje=${response.message}`
            );
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(`Error al crear asignación de usuario/sistema:`, error);
          let errorMessage = `No se pudo crear la asignación de usuario/sistema.`; // Default user-friendly message

          if (error.error && error.error.message) {
            errorMessage = error.error.message; // Use backend message if available
          } else if (error.message) {
            errorMessage = error.message; // Use general HTTP error message
          } else if (error.status === 400) {
            errorMessage = `Datos inválidos proporcionados para la asignación.`;
          } else if (error.status === 409) {
            errorMessage = `La asignación de usuario/sistema/rol ya existe o hay un conflicto.`;
          }
          return throwError(() => new Error(errorMessage)); // Re-throw with user-friendly message
        })
      );
  }

  public deleteUserSistema(
    usuario_id: number,
    sistema_id: number
  ): Observable<UserSistemaDelete> {
    return this.http
      .delete<UserSistemaDelete>(
        `${this.urlBase}/${usuario_id}/${sistema_id}`,
        {
          headers: this.authService.getAuthHeaders(),
        }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(
            `Error al eliminar el usuario con id: ${usuario_id}`,
            error
          );
          let customErrorMessage = 'Error inesperado al eliminar el usuario.';
          if (error.status === 404) {
            customErrorMessage =
              error.error?.message ||
              `La asignación para el usuario con ID ${usuario_id} y sistema ID ${sistema_id} no ha sido encontrada.`;
          } else if (
            error.error &&
            typeof error.error === 'object' &&
            error.error.message
          ) {
            // Catch other backend-provided messages
            customErrorMessage = error.error.message;
          } else if (typeof error.error === 'string') {
            // Catch plain string errors
            customErrorMessage = error.error;
          }
          return throwError(() => new Error(customErrorMessage));
        })
      );
  }
}
