import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { AuthUser } from '../services/auth-user.service';
import { environment } from '../../environments/environment.development';
import { AuthUserService } from './auth-user.service';

@Injectable({
  providedIn: 'root'
})
export default class AuthService {

  httpClient= inject(HttpClient);
  private authUserService = inject(AuthUserService);
  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public currentUser:Observable<AuthUser | null>;

  constructor() {
    const storedUser = localStorage.getItem('authUser');
    this.currentUserSubject = new BehaviorSubject<AuthUser | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }


  login(data: any, endpointType:'main' | 'user'):Observable<string>{
    let url:string;
    let role:string;

    if(endpointType === 'main') {
      url = `${environment.apiURL}/auth/login`;
      role = 'main';
    } else if (endpointType === 'user') {
      url = `${environment.apiURL}/auth/login`;
      role = 'user';
    } else {
      return throwError(()=> new Error('Ruta no existe'));
    }

    return this.httpClient.post<any>(url, data).pipe(
      tap( response =>{
        const authUser: AuthUser ={
          token: response.token,
          username: response.username || data.username,
          role: role,
          id: response.id || response.id_usuario,
        };
        localStorage.setItem('authUser', JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
      }),
      catchError(error =>{
        console.error('Login error: ', error);
        return throwError(()=> new Error(error.error?.message || 'Login error: Revisar credenciales'));
      })
    );
  }

  logout():void{
    localStorage.removeItem('authUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn():boolean{
    return this.currentUserSubject.value !== null;
  }

  isAdmin():boolean{
    return this.currentUserSubject.value?.role === 'admin';
  }

  isRegularUser():boolean{
    return this.currentUserSubject.value?.role === 'regular_user';
  }



  // httpClient = inject(HttpClient);
  // baseURL='https://app.dirislimanorte.gob.pe:8080/api';
  
  // login(data: any): Observable<any>{
  //   return new Observable(observer => {
  //     return this.httpClient.post(`${this.baseURL}/auth/login`, data).subscribe({
  //       next: (response: any) => {
  //         observer.next(response.token);
  //         observer.complete();
  //         localStorage.setItem('authUser',response.token);
  //       },
  //       error: (error: any) => {
  //         observer.error(error);
  //         observer.complete();
  //       }
  //     })
  
  //   })
  // }
  
  // logout(){
  //   localStorage.removeItem('authUser');
  // }
  
  // isLoggedIn(){
  //   return localStorage.getItem('authUser') !== null;
  // }
  // constructor() { }
}
