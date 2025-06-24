import { CommonModule } from '@angular/common';
import {

  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,

} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {  MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../../shared/header/header.component';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';

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
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches), shareReplay()
    );

    isDesktop$: Observable<boolean> = this.breakpointObserver.observe([
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).pipe(
      map(result => result.matches), shareReplay()
    );

    isHandset = false;
    isDesktop = false;

  ngOnInit(): void {
    // this.isHandset$.pipe(takeUntil(this.destroy$)).subscribe(value=>{
    //   this.isHandset = value;
    //   if(this.sidenav){
    //     if(value){
    //       this.sidenav.close();
    //     }
    //     else{
    //       this.sidenav.open();
    //     }
    //   }
    // });

    // this.isDesktop$.pipe(takeUntil(this.destroy$)).subscribe(value=>{
    //   this.isDesktop = value;
    // });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
