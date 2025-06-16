import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SwalAlertService } from '../../services/swal-alert.service';
import {
  UserService,
  UsuariosData,
} from '../../services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { DisplayColumn } from '../../auth/models/response/response.model';
import { MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinner
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css',
})
export class ListaUsuariosComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  readonly dialog = inject(MatDialog);
  private swalAlertService = inject(SwalAlertService);
  private usuarioService = inject(UserService);
  private destroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<UsuariosData>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLoadingResults = true;
  resultLength=0;
  displayColumn: string[]= ['id','nombre','apellido','correo','estado','created_at','updated_at','actions'];
  paginado: number[]= [5,10,20,50];
  constructor(){}


  obtenerListaUsuarios(): void {
    this.usuarioService
      .getListaUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: UsuariosData[]) => {
          this.dataSource.data = data;
          this.isLoadingResults = false;
          this.resultLength = data.length;
        },
        error: (err) => {
          console.error('error al cargar Usuarios', err);
          this.isLoadingResults = false;
          this.dataSource.data = [];
          this.swalAlertService.showError('Error al cargar los usuarios');
        },
      });
  }

  abrirUsuarioFormDialog():void{

  }

  eliminarUsuario(){

  }
  ngOnInit(): void {
    this.obtenerListaUsuarios();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}
