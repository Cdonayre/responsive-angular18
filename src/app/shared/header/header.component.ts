import { Component, inject } from '@angular/core';

import { Router } from '@angular/router';
import AuthService from '../../auth/services/auth.service';

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

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
       console.error('Logout error:', err);
        this.router.navigate(['/login']);
      },
    });
  }
  
}
