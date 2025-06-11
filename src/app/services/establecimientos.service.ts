import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import AuthService from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientosService {

  constructor(private authService:AuthService) { }
  private http =  inject(HttpClient);
  private URLbase = environment.apiURL+'/Establecimientos';
  establecimientos:EstablecimientosEdit[]=[];
  establecimientosActualizados =  new Subject<EstablecimientosEdit[]>;

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

    public getEstablecimientos():Observable<EstablecimientosEdit[]>{
      return this.http.get<EstablecimientosEdit[]>(this.URLbase, { headers: this.getAuthHeaders() })
          .pipe(
            catchError(error=>{
              console.error('Error fetching usuarios ',error);
              return throwError(()=>error);
            })
          );
    }  
    listaEstablecimientos():Observable<EstablecimientosEdit[]>{
      return this.http.get<EstablecimientosEdit[]>(this.URLbase, { headers: this.getAuthHeaders() })
    .pipe(
      catchError(error=>{
        console.error('Error fetching usuarios ',error);
        return throwError(()=>error);
      })
    );
    }
    public postEstablecimiento(establecimiento: EstablecimientosEdit):Observable<EstablecimientosEdit>{
      return this.http.post<EstablecimientosEdit>(this.URLbase, establecimiento, { headers: this.getAuthHeaders() })
    .pipe(
      catchError(error=>{
        console.error('Error fetching usuarios ',error);
        return throwError(()=>error);
      })
    );
    }
    reloadEstablecimientos(){
      this.listaEstablecimientos().subscribe((establecimiento:EstablecimientosEdit[])=>{
        this.setEstablecimientos(establecimiento);
      })
    }
    setEstablecimientos(establecimiento:EstablecimientosEdit[]){
      this.establecimientos = establecimiento;
      this.establecimientosActualizados.next(this.establecimientos)//emits the list updated
    }
    public putEstablecimiento(establecimiento: EstablecimientosEdit):Observable<any>{
      return this.http.put<EstablecimientosEdit>(this.URLbase+'/'+establecimiento.id, establecimiento, { headers: this.getAuthHeaders() })
    .pipe(
      catchError(error=>{
        console.error('Error fetching usuarios ',error);
        return throwError(()=>error);
      })
    );
    }
    public deleteEstablecimiento(id:number):Observable<any>{
      return this.http.delete<EstablecimientosEdit>(this.URLbase+'/'+id, { headers: this.getAuthHeaders() })
    .pipe(
      catchError(error=>{
        console.error('Error fetching usuarios ',error);
        return throwError(()=>error);
      })
    );
    }
}

export interface EstablecimientosEdit {
  id:              number;
  departamento_id: number;
  provincia_id:    number;
  distrito_id:     number;
  ris_id:          number;
  categoria_id:    number;
  codigo:          string;
  nombre:          string;
}
