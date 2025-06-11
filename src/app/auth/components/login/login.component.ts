import {
  ChangeDetectorRef,
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  timer,
  take,
  takeUntil,
  Subject,
  Subscription,
  Observable,
} from 'rxjs';
import { ROUTE_PATHS } from '../../../global/constants/route.constants';
import AuthService from '../../services/auth.service';
import {
  DataResponse,
  LoginRequest,
  LogiResponse,
} from '../../models/login.model';
import { VerifyCodeRequest } from '../../models/verify-code.model';
import { MessageCardComponent } from '../../../shared/message-card/message-card.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { ResponseSimple } from '../../models/response/response.model';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    MatSidenavModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MessageCardComponent,
    MatInputModule,
    MatIconModule,
    MatButton,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  titleLogin = 'DIRIS LIMA NORTE';
  subTitleLogin = '';
  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  formLoginUser = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
  });
  unsubscribe$: Subject<any> = new Subject();
  hide = signal(true);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  tipoLogin: 'main' | 'user' = 'main';

  public ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([ROUTE_PATHS.DASHBOARD]);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  onSubmitFirstStep(): void {
    let loginRequest: LoginRequest;
    let loginObservable: Observable<LogiResponse>;

    if (this.tipoLogin === 'main') {
      if (this.formLogin.invalid) {
        this.formLogin.markAllAsTouched();
        this.showErrorAlert(
          'Formulario Inválido',
          'Por favor, ingrese un correo electrónico y contraseña válidos.'
        );
        return;
      }
      loginRequest = {
        email: this.formLogin.get('email')?.value || '',
        password: this.formLogin.get('password')?.value || '',
      };
      loginObservable = this.authService.loginAuth(loginRequest);
      loginObservable.pipe(take(1)).subscribe({
        next: (res) => {
          if (this.authService.isAuthenticated()) {
            Swal.fire({
              icon: 'success',
              title: '¡Bienvenido!',
              text: 'Inicio de sesión exitoso.',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate([ROUTE_PATHS.DASHBOARD]);
            });
          } else {
            this.showErrorAlert(
              'Error de autenticación',
              'Inicio de sesión incompleto. Inténtelo de nuevo.'
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorAlert(
            'Error de Autenticación',
            error?.error?.data?.message ||
              'Credenciales inválidas o error del servidor.'
          );
        },
      });
    } else {
      if (this.formLoginUser.invalid) {
        this.formLoginUser.markAllAsTouched();
        this.showErrorAlert(
          'Formulario Inválido',
          'Por favor, ingrese un nombre de usuario y clave válidos.'
        );
        return;
      }
      loginRequest = {
        usuario: this.formLoginUser.get('usuario')?.value || '',
        clave: this.formLoginUser.get('clave')?.value || '',
      };
      loginObservable = this.authService.loginUser(loginRequest);

      loginObservable.pipe(take(1)).subscribe({
        next: (res) => {
          if (this.authService.isAuthenticated()) {
            Swal.fire({
              icon: 'success',
              title: '¡Bienvenido!',
              text: 'Inicio de sesión exitoso.',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate([ROUTE_PATHS.DASHBOARD]);
            });
          } else {
            this.showErrorAlert(
              'Error de autenticación',
              'Inicio de sesión incompleto. Inténtelo de nuevo.'
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          this.showErrorAlert(
            'Error de Autenticación',
            error?.error?.data?.message ||
              'Credenciales inválidas o error del servidor.'
          );
        },
      });
    }
  }

  switchLoginType(type: 'main' | 'user'): void {
    this.tipoLogin = type;
    this.formLogin.reset();
    this.formLoginUser.reset();
  }

  private showErrorAlert(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#f44336',
    });
  }

  hidePassw(__event: MouseEvent) {
    this.hide.update((current) => !current);
  }
}
