import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { StorageEncryptService } from '../../services/storage/storage-encrypt.service';
import { STORAGE_KEYS } from '../../global/constants/storage.constants';
import { LoginRequest, DataResponse, LoginResponse, LogiResponse } from '../models/login.model';
import { VerifyCodeRequest, VerifyCodeResponse } from '../models/verify-code.model';
import { AuthMe } from '../models/authme.model';
import { ResponseModelById } from '../models/response/response.model';
import { jwtDecode } from 'jwt-decode';
import { AuthUser, AuthUserTokenPayload } from '../models/auth-user.model';

@Injectable({
  providedIn: 'root'
})
export default class AuthService {

  private readonly http = inject(HttpClient);
  private readonly storageEncrypt = inject(StorageEncryptService); 
  private auth_token = 'authentication_value';
  private readonly tokenKey = STORAGE_KEYS.TOKEN;

  private currentUserSubject: BehaviorSubject<AuthUser | null>;
  public  currentUser: Observable<AuthUser | null>;

  constructor() {
    const storedAuthUserJson= this.storageEncrypt.get(this.tokenKey);
    let initialAuthUser: AuthUser | null = null;
    if(storedAuthUserJson){
      try{
        const parsedAuthUser:AuthUser =JSON.parse(storedAuthUserJson);
        if(this.isTokenValid(parsedAuthUser.token)){
          initialAuthUser=parsedAuthUser;
        }else{
          this.storageEncrypt.removeData(this.tokenKey);
        }
      }catch(err){
        console.error("Error en stored user data", err);
        this.storageEncrypt.removeData(this.tokenKey);
      }
    }
    this.currentUserSubject=new BehaviorSubject<AuthUser| null>(initialAuthUser);
    this.currentUser=this.currentUserSubject.asObservable();

  }
  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  private isTokenValid(token: string): boolean {
    if (!token) {
      return false;
    }
    try {
      const decoded: AuthUserTokenPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp ? decoded.exp > currentTime : true;
    } catch (err) {
      console.warn("Token decoding failed:", err);
      return false;
    }
  }

  public getToken(): string | null {
    const authUser = this.currentUserSubject.value;
    return authUser ? authUser.token : null;
  }

  public getDataToken():( AuthUserTokenPayload & {userType?: 'admin_dashboard_user'| 'regular_api_user'}) | null {
    const authUser= this.currentUserSubject.value;
    if(authUser && authUser.token){
      try{
        const decodedPayload:AuthUserTokenPayload = jwtDecode(authUser.token);
        return {...decodedPayload, userType: authUser.userType};
      }catch(err) {
        console.error("Error decoding token:", err);
        return null;
      }
    }
    return null;
  } 

  public isAuthenticated(): boolean {
    const authUser = this.currentUserSubject.value;
    return authUser !== null && this.isTokenValid(authUser.token);
  }

  public isAdminDashboardUser(): boolean {
    return this.currentUserSubject.value?.userType === 'admin_dashboard_user' && this.isAuthenticated();
  }
  public isRegularApiUser():Boolean{
    return this.currentUserSubject.value?.userType === 'regular_api_user' && this.isAuthenticated();
  }

  public loginAuth(req: LoginRequest): Observable<LogiResponse> {
    return this.http
      .post<LogiResponse>(`${environment.apiURL}/auth/login`, req)
      .pipe(
        map((res) => {
         const authUser: AuthUser = {
            token: res.token,
            userType: 'admin_dashboard_user',
        };
          this.storageEncrypt.set(this.tokenKey, JSON.stringify(authUser));
          this.currentUserSubject.next(authUser);
          return res;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  public loginUser(req:LoginRequest):Observable<LogiResponse>{
    return this.http
    .post<LogiResponse>(`${environment.apiUserUrl}/auth/login`, req)
    .pipe(
      tap((res)=>{
        const authUser: AuthUser={
          token: res.token,
          userType:'regular_api_user',
        };
        this.storageEncrypt.set(this.tokenKey, JSON.stringify(authUser));
        this.currentUserSubject.next(authUser);
      }),
      catchError((err)=>{
        return throwError(() => err);
      })
    )
  }

  public logout(): Observable<boolean> {
    const currentUserType = this.currentUserSubject.value?.userType;
    let logoutUrl: string;

    if (currentUserType === 'admin_dashboard_user') {
      logoutUrl = `${environment.apiURL}/auth/login`;
    } else if (currentUserType === 'regular_api_user') {
      logoutUrl = `${environment.apiUserUrl}/auth/login`;
    } else {
      this.storageEncrypt.removeData(this.tokenKey);
      this.currentUserSubject.next(null);
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }
    return this.http
      .post<LoginResponse>(logoutUrl, {})
      .pipe(
        map((res) => {
          this.storageEncrypt.removeData(this.tokenKey);
          this.currentUserSubject.next(null);
          return true;
        }),
        catchError((error) => {
          console.error('Logout error en el backend, pero se ha limpiado el token del cliente', error);
          this.storageEncrypt.removeData(this.tokenKey);
          this.currentUserSubject.next(null);
          return throwError(() => error);
        })
      );
  }

  public me(): Observable<AuthMe> {
    const currentUserType = this.currentUserSubject.value?.userType;
    let apiURLForMe: string;

    if(currentUserType === 'admin_dashboard_user'){
      apiURLForMe = `${environment.apiURL}/auth/me`;
    }else if(currentUserType === 'regular_api_user'){
      apiURLForMe = `${environment.apiUserUrl}/auth/me`;

    }else{
      return throwError(() => new Error('User type not recognized'));
    }
      return this.http
        .get<ResponseModelById<AuthMe>>(
          apiURLForMe
        )
        .pipe(
          map((res) => {
            return res?.data?.result;
          }),
          catchError((error) => {
            return throwError(() => error);
          })
        );
  }



  //***************************begin second auth service **************************//
  // httpClient= inject(HttpClient);
  // private authUserService = inject(AuthUserService);
  // private currentUserSubject: BehaviorSubject<AuthUser | null>;
  // public currentUser:Observable<AuthUser | null>;

  // constructor() {
  //   const storedUser = localStorage.getItem('authUser');
  //   this.currentUserSubject = new BehaviorSubject<AuthUser | null>(
  //     storedUser ? JSON.parse(storedUser) : null
  //   );
  //   this.currentUser = this.currentUserSubject.asObservable();
  // }

  // public get currentUserValue(): AuthUser | null {
  //   return this.currentUserSubject.value;
  // }


  // login(data: any, endpointType:'main' | 'user'):Observable<string>{
  //   let url:string;
  //   let role:string;

  //   if(endpointType === 'main') {
  //     url = `${environment.apiURL}/auth/login`;
  //     role = 'main';
  //   } else if (endpointType === 'user') {
  //     url = `${environment.apiURL}/auth/login`;
  //     role = 'user';
  //   } else {
  //     return throwError(()=> new Error('Ruta no existe'));
  //   }

  //   return this.httpClient.post<any>(url, data).pipe(
  //     tap( response =>{
  //       const authUser: AuthUser ={
  //         token: response.token,
  //         username: response.username || data.username,
  //         role: role,
  //         id: response.id || response.id_usuario,
  //       };
  //       localStorage.setItem('authUser', JSON.stringify(authUser));
  //       this.currentUserSubject.next(authUser);
  //     }),
  //     catchError(error =>{
  //       console.error('Login error: ', error);
  //       return throwError(()=> new Error(error.error?.message || 'Login error: Revisar credenciales'));
  //     })
  //   );
  // }

  // logout():void{
  //   localStorage.removeItem('authUser');
  //   this.currentUserSubject.next(null);
  // }

  // isLoggedIn():boolean{
  //   return this.currentUserSubject.value !== null;
  // }

  // isAdmin():boolean{
  //   return this.currentUserSubject.value?.role === 'admin';
  // }

  // isRegularUser():boolean{
  //   return this.currentUserSubject.value?.role === 'regular_user';
  // }
//******************End second auth service ******************//

//**********************begin firs auth service ***************//
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
  //************************end first auth service *************************//
}



