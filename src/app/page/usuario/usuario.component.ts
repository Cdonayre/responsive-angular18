import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService, UsuarioCrear, Usuarios, UsuarioSistemas } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil, tap } from 'rxjs';
import { getSpanishPaginatorIntl } from '../../helper/general-function';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';
import Swal from 'sweetalert2';
import { SwalAlertService } from '../../services/swal-alert.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  providers: [
    {
      provide: MatPaginatorIntl,
      useValue: getSpanishPaginatorIntl(),
    },
  ],
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
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export default class UsuarioComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  readonly dialog = inject(MatDialog);
  private swalAlertService=inject(SwalAlertService);
  private usuarioService = inject(UserService);
  private destroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<UsuarioSistemas>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // listaUsuarios: UsuarioSistemas = {
  //   dni: '',
  //   id_usuario: 0,
  //   correo: '',
  //   nombre: '',
  //   apellido: '',
  //   nombre_usuario: '',
  //   id_sistema: 0,
  //   nombre_sistema: '',
  //   id_rol: 0,
  //   nombre_rol: '',
  // };

  displayedColumns: string[] = [
    'dni',
    'nombre',
    'apellido',
    'nombre_usuario',
    'correo',
    'nombre_rol',
    'actions',
  ];

  resultLength = 0;
  isLoadingResults = true;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  cargarUsuariosSistemas(): void {
    this.isLoadingResults = true;
    this.usuarioService
      .getUsuariosSistemas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: UsuarioSistemas[]) => {
          this.dataSource.data = data;
          this.isLoadingResults = false;
          console.log('cargando UsuarioSistemas', this.dataSource);
        },
        error: (err) => {
          console.error('error al cargar UsuarioSIstemas: ', err);
          this.isLoadingResults = false;
          this.dataSource.data = [];
        },
      });
  }

  constructor() {}
  ngOnInit(): void {
    this.cargarUsuariosSistemas();
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
  processAndSetDataSource(usuarioData: UsuarioSistemas[]): void {
   this.dataSource.data=usuarioData;
   if (!this.paginator) {
    this.dataSource.paginator = this.paginator;
   }
  }

  openDialog(usuarios: UsuarioSistemas | null) {
    const dialogref = this.dialog.open(FormUsuarioComponent, {
      data: usuarios,
    });
    dialogref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(dialogResult => {
        console.log(`Se ha cerrado`);
        if(dialogResult==true){
          this.refreshTable();
        }
      });
  }

  refreshTable() {
    this.usuarioService
      .getUsuariosSistemas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datos: UsuarioSistemas[]) => {
          this.processAndSetDataSource(datos);
        },
        error: (err: any) => {
          console.error('Error al refrescar la tabla:', err);
          Swal.fire('Error', 'No se pudo refrescar la tabla', 'error');
        },
      });
  } 

  eliminarUser(user: UsuarioSistemas): void {
    this.swalAlertService.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUSer(user.id_usuario).pipe(takeUntil(this.destroy$)).subscribe({
          next: (datos:any) => {
            this.swalAlertService.showSuccess('El usuario ha sido eliminado correctamente', 'Eliminado!');
            this.refreshTable();
          },
          error: (err:any) => {
            console.error('Error al eliminar el establecimiento:', err);
            this.swalAlertService.showError('No se pudo eliminar el usuario');
          }
        });
      }
    });
  }

  // usuariosPaginados():void{
  //   this.isLoadingResults = true;
  //   if (!this.paginator){
  //     console.error('La paginación no se encuentra disponible');
  //     this.isLoadingResults=false;
  //     return;
  //   }
  //   const page = this.paginator.pageIndex + 1;
  //   const limit = this.paginator.pageSize;

  //   this.usuarioService.getUsuariosPaginado(page, limit)
  //   .subscribe({
  //     next:(data: any)=> {
  //       console.log(data);
  //       this.isLoadingResults = false;
  //       this.resultLength = data.totalUsers;
  //       this.dataSource = data;
  //     },
  //     error:(err)=> {
  //       this.isLoadingResults = false;
  //       console.error('Error al obtener la paginación de usuarios:', err);
  //       this.dataSource = [];
  //       this.resultLength = 0
  //     }
  //   });
  // }
}
