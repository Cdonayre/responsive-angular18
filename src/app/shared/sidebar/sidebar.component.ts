import { Component, inject, Input, OnInit } from '@angular/core';
import { routes } from '../../app.routes';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import AuthService from '../../auth/services/auth.service';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
interface SidebarMenuItem {
  path: string;
  label: string;
  icon: string;
  visibleToUserTypes: ('admin_dashboard_user' | 'regular_api_user')[];
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatSidenavModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private router = inject(Router);
  private subscriptions: Subscription = new Subscription();
  public menuItems: SidebarMenuItem[] = [];
  @Input() isHandset!: boolean;
  @Input() isDesktop!: boolean;
  constructor() {}
  ngOnInit(): void {
    this.buildMenuItems();
    this.subscriptions.add(
      this.authService.currentUser.subscribe(() => {
        this.buildMenuItems();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private async buildMenuItems(): Promise<void> {
    const currentUserType = this.authService.currentUserValue?.userType;
    if (!currentUserType) {
      this.menuItems = [];
      return;
    }
    const extractRoutesForSidebar = (
      routerConfig: any[]
    ): SidebarMenuItem[] => {
      const items: SidebarMenuItem[] = [];
      routerConfig.forEach((route) => {
        if (
          route.path &&
          !route.path.includes(':') &&
          route.data?.['label'] &&
          route.data?.['icon'] &&
          route.data?.['visibleToUserTypes']
        ) {
          items.push({
            path: route.path,
            label: route.data['label'],
            icon: route.data['icon'],
            visibleToUserTypes: route.data['visibleToUserTypes'],
          });
        }
        if (route.children) {
          items.push(...extractRoutesForSidebar(route.children));
        }
      });
      return items;
    };

    try {
      const { ADMIN_ROUTES } = await import(
        '../../admin/bussiness/business.routes'
      );

      const allPossibleMenuItems = extractRoutesForSidebar(ADMIN_ROUTES);
      this.menuItems = allPossibleMenuItems.filter((item) =>
        item.visibleToUserTypes.includes(currentUserType)
      );
      console.log('Filtered menuItems:', this.menuItems); // Debugging
    } catch (error) {
      console.error('Error loading business routes for sidebar:', error);
      this.menuItems = [];
    }
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

  //   private buildMenuItems: void{

  //   }

  // }

  // public menuItems = routes
  // .map(route => route.children ?? [])
  // .flat()
  // .filter(route => route && route.path)
  // .filter(route => !route.path?.includes(':'))
}
