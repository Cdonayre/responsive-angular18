import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DeleteResponse,
  Roles,
  User,
  UserService,
  UsuarioCrear,
  Usuarios,
  UsuarioSistemas,
} from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
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
import { Subject, Subscription, takeUntil, tap } from 'rxjs';
import { getSpanishPaginatorIntl } from '../../helper/general-function';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';
import Swal from 'sweetalert2';
import { SwalAlertService } from '../../services/swal-alert.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

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
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export default class UsuarioComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  readonly dialog = inject(MatDialog);
  private swalAlertService = inject(SwalAlertService);
  private usuarioService = inject(UserService);
  private destroy$ = new Subject<void>();
  private subscripcion: Subscription = new Subscription();
  rolSeleccionado: number = 0; // 0: admin, 1: usuario normal
  dataSource = new MatTableDataSource<UsuarioSistemas>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public roles: Roles[] = [
    { id: 0, descripcion: 'Ninguno' },
    { id: 1, descripcion: 'Administrador' },
    { id: 2, descripcion: 'Supervisor' },
    { id: 3, descripcion: 'Empleado' },
  ];

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
      .getUsuariosSistemas(this.rolSeleccionado)
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
  loadUsuariosByRol(): void {
    this.isLoadingResults = true;
    this.usuarioService
      .getUsuariosSistemas(this.rolSeleccionado)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: User[]) => {
          this.dataSource.data = data;
          this.isLoadingResults = false;
          if (this.paginator && this.dataSource.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          console.log('Usuarios cargados');
        },
        error: (err) => {
          console.error('error al cargar UsuarioSIstemas: ', err);
          this.isLoadingResults = false;
          this.dataSource.data = [];
          this.swalAlertService.showError(
            'Error al cargar los usuarios del sistema'
          );
        },
      });
  }
  onRolChange(event: any) {
    this.rolSeleccionado = event.value;
    console.log('Rol seleccionado', this.rolSeleccionado);
    this.loadUsuariosByRol();
  }
  ngOnInit(): void {
    this.loadUsuariosByRol();
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
  // processAndSetDataSource(usuarioData: UsuarioSistemas[]): void {
  //  this.dataSource.data=usuarioData;
  //  if (!this.paginator) {
  //   this.dataSource.paginator = this.paginator;
  //  }
  // }

  openDialog(user: User | null) {
    const dialogref = this.dialog.open(FormUsuarioComponent, {
      data: user,
    });
    dialogref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dialogResult) => {
        console.log(`Se ha cerrado. resultado ${dialogResult}`);
        if (dialogResult == true) {
          this.refreshTable();
        }
      });
  }

  refreshTable() {
    this.loadUsuariosByRol();
  }

  eliminarUser(user: User): void {
    this.swalAlertService.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.usuarioService
          .deleteUSer(user.id_usuario)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response: DeleteResponse) => {
              this.swalAlertService.showSuccess(
                response.message,
                'Eliminado!'
              );
              this.refreshTable();
            },
            error: (err: any) => {
              console.error(`Error al eliminar el usuario con id ${user.id_usuario}:`, err);
              const errorMessage = err.message || 'No se pudo eliminar el usuario. Intente de nuevo';
              this.swalAlertService.showError(errorMessage);
            },
          });
      }
    });
  }
}
