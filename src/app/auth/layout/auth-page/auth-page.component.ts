import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ROUTE_PATHS } from '../../../global/constants/route.constants';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { LoginComponent } from '../../components/login/login.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    LoginComponent,
    FooterComponent,
    MatButtonModule,
    RouterOutlet,
    RouterModule,

  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
})
export class AuthPageComponent {
  @Input() isLogin = true;
  public todayDate: Date = new Date();
  private router = inject(Router);

  goBack(): void {
    this.router.navigate([ROUTE_PATHS.LOGIN]);
  }
}
