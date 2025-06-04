import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import AuthService from '../../auth/auth.service';
import { AuthUserService } from '../../auth/auth-user.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ReactiveFormsModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  authService = inject(AuthService);
  //authUserService = inject(AuthUserService);
  router = inject(Router);
  swalAlertService = inject(SwalAlertService);
  tipoLogin: 'main' | 'user' = 'main';

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  protected loginFormUser = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    clave: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    let loginData: any;
    let endpointType: 'main' | 'user';

    if (this.tipoLogin === 'main') {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        this.swalAlertService.showError(
          'Formulario inválido',
          'Por favor ingrese usuario y contraseña válidos.'
        );
        return;
      }
      loginData = {
        username: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      endpointType = 'main';
    } else {
      if (this.loginFormUser.invalid) {
        this.loginFormUser.markAllAsTouched();
        this.swalAlertService.showError(
          'Formulario inválido',
          'Por favor ingrese usuario y contraseña válidos.'
        );
        return;
      }
      loginData = {
        username: this.loginFormUser.value.usuario,
        password: this.loginFormUser.value.clave,
      };
      endpointType = 'user';
    }

    this.authService.login(loginData, endpointType).subscribe({
      next: (token) => {
        if (this.authService.isLoggedIn()) {
          this.swalAlertService.showSuccess(
            'Login exitoso',
            'Bienvenido al sistema'
          );
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error de inicio de sesión:', error);
        this.swalAlertService.showError(
          'Error de inicio de sesión',
          error.message || 'Por favor, revise sus credenciales.'
        );
      },
    });
  }
  switchLoginType(tipo: 'main' | 'user'): void {
    this.tipoLogin = tipo;
  }

  // onSubmit(){
  //  switch(Number(this.tipoLogin)){
  //   case 1:
  //     if(this.loginForm.valid){
  //       this.authService.login(this.loginForm.value)
  //       .subscribe((data:any)=> {
  //         if(this.authService.isLoggedIn()){
  //           this.router.navigate(['/dashboard']);
  //         }}
  //       );
  //     }
  //     break;
  //     case 2:
  //       if(this.loginFormUser.valid){
  //         this.authUserService.login(this.loginFormUser.value)
  //         .subscribe((data:any)=> {
  //           if(this.authUserService.isLoggedIn()){
  //             this.router.navigate(['/dashboard']);
  //           }}
  //         );
  //       }
  //     }
  //   }
}
