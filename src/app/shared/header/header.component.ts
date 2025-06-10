import { Component, inject } from '@angular/core';
import AuthService from '../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  public router = inject(Router);
  constructor(private authService:AuthService) {
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  
}
