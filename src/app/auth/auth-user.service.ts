import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  httpClient = inject(HttpClient);
    private urlUser= environment.apiUserUrl
    
    login(data: any): Observable<any>{
      return new Observable(observer => {
        return this.httpClient.post(`${this.urlUser}/auth/login`, data).subscribe({
          next: (response: any) => {
            observer.next(response.token);
            observer.complete();
            localStorage.setItem('authUser',response.token);
          },
          error: (error: any) => {
            observer.error(error);
            observer.complete();
          }
        })
    
      })
    }
    
    logout(){
      localStorage.removeItem('authUser');
    }
    
    isLoggedIn(){
      return localStorage.getItem('authUser') !== null;
    }
    constructor() { }


}
