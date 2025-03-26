import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientosService {

  constructor() { }
  private http =  inject(HttpClient);
  private URLbase = environment.apiURL+'/establecimientos';
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

    public getEstablecimientos():Observable<any>{
      return this.http.get(this.URLbase, this.getHttpOptions());  
    }  

    // public postEstablecimiento(establecimiento: Partial<EstablecimientosEdit>):Observable<any>{
    //   return this.http.post<EstablecimientosEdit>(this.URLbase, establecimiento, this.getHttpOptions());
    // }

    listaEstablecimientos():Observable<EstablecimientosEdit[]>{
      return this.http.get<EstablecimientosEdit[]>(this.URLbase, this.getHttpOptions());
    }

    public postEstablecimiento(establecimiento: EstablecimientosEdit):Observable<any>{
      return this.http.post<EstablecimientosEdit>(this.URLbase, establecimiento, this.getHttpOptions());
    }

    reloadEstablecimeintos(){
      this.listaEstablecimientos().subscribe((establecimiento:EstablecimientosEdit[])=>{
        this.setEstablecimientos(establecimiento);
      })
    }

    setEstablecimientos(establecimiento:EstablecimientosEdit[]){
      this.establecimientos = establecimiento;
      this.establecimientosActualizados.next(this.establecimientos)//emits the list updated
    }

    public putEstablecimiento(establecimiento: EstablecimientosEdit):Observable<any>{
      return this.http.put<EstablecimientosEdit>(this.URLbase+'/'+establecimiento.id, establecimiento, this.getHttpOptions());
    }
    public deleteEstablecimiento(id:number):Observable<any>{
      return this.http.delete<EstablecimientosEdit>(this.URLbase+'/'+id, this.getHttpOptions());
    }

}


// export interface Establecimientos {
//   id:               number;
//   departamento_id: number;
//   provincia_id:    number;
//   distrito_id:     number;
//   ris_id:          number;
//   categoria_id:    number;
//   codigo:          string;
//   nombre:          string;
//   zona_utm:        string;
//   este:            number;
//   norte:           number;
//   geometry:        string;
//   latitud:         number;
//   longitud:        number;
//   zona_sanitaria:  string;
//   poblacion:       number;
//   estado:          boolean;
//   created_at:      Date;
//   updated_at:      Date;
// }

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
