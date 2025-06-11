import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import AuthService from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private authService:AuthService) { }
  private http =  inject(HttpClient);
  private URLbase = environment.apiURL+'/categorias';

  getToken(){
    return localStorage.getItem('authUser');
  }
  private getHttpOptions() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token? `Bearer ${token}`:''
      })
    };
  }
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
  public getCategorias():Observable<any>{
    return this.http.get(this.URLbase, { headers: this.getAuthHeaders() })
        .pipe(
          catchError(error=>{
            console.error('Error fetching usuarios ',error);
            return throwError(()=>error);
          })
        );
  }  
}

export interface Categorias {
  id:         number;
  nombre:     string;
  created_at: Date;
  updated_at: Date;
  }
  