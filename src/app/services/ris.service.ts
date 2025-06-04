import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RisService {

  constructor() { }
  private http=inject(HttpClient);
  private urlBase = environment.apiURL + '/ris';

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
  public getRis():Observable<Ris[]>{
    return this.http.get<Ris[]>(this.urlBase, this.getHttpOptions());
  }
}

export interface Ris {
  id:         number;
  nombre:     string;
  created_at: Date;
  updated_at: Date;
}
