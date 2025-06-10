import { CommonModule } from '@angular/common';
import {
 
  Component,

} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {  MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../../shared/header/header.component';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatCardModule,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {

}
