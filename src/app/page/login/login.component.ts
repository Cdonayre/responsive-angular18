import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import AuthService from '../../auth/services/auth.service';
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
