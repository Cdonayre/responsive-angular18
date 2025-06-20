import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
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
  DeleteResponse,
  User,
  UserService,
  UsuariosData,
} from '../../services/user.service';
import { Subject, takeUntil } from 'rxjs';
import {
  MatProgressSpinner,
} from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { FormUsuarioComponent } from '../usuario/form-usuario/form-usuario.component';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioSistemaService } from '../../services/usuario-sistema.service';
import { UserSistemaData } from '../usuario-sistema/models/usuario-sistema.model';
import { UsuarioSistemaComponent } from '../usuario-sistema/usuario-sistema.component';

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
    MatProgressSpinner,
    MatInputModule,
    ReactiveFormsModule,

  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css',
})
export class ListaUsuariosComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  readonly dialog = inject(MatDialog);
  private swalAlertService = inject(SwalAlertService);
  private usuarioSistemaService = inject(UsuarioSistemaService);
  private usuarioService = inject(UserService);
  private destroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<UsuariosData>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLoadingResults = true;
  resultLength = 0;
  displayColumn: string[] = [
    'id',
    'nombre',
    'apellido',
    'correo',
    'estado',
    'created_at',
    'updated_at',
    'actions',
  ];
  paginado: number[] = [5, 10, 20, 50];
  filterControl = new FormControl('');
  constructor() {}

  abrirAsignaciones(user: UsuariosData): void {
    if (!user || !user.id) {
      this.swalAlertService.showError(
        'Error',
        'No se pudo obtener el ID del usuario.'
      );
      return;
    }

    this.usuarioSistemaService.getUserSistemaByUserId(user.id).subscribe({
      next: (userSistemasData: UserSistemaData) => {
        console.log('Assignments data fetched for user:', user.id, userSistemasData);
        this.dialog.open(UsuarioSistemaComponent, {
          width: '600px',
          data: userSistemasData
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching user assignments for dialog:', err);
        let errorMessage = 'No se pudieron cargar las asignaciones del usuario.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.status) {
          errorMessage = `Error ${err.status}: ${err.statusText || 'Error desconocido'}`;
        }
        this.swalAlertService.showError('Error de Carga', errorMessage);
      }
    });
  }

  obtenerListaUsuarios(): void {
    this.isLoadingResults = true;
    this.usuarioService
      .getListaUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: UsuariosData[]) => {
          this.dataSource.data = data;
          this.isLoadingResults = false;
          this.resultLength = data.length;
          this.dataSource.filter = this.filterControl.value
            ? this.filterControl.value.trim().toLocaleLowerCase()
            : '';
          this.dataSource.filterPredicate = this.createCustomFilterPredicate();
        },
        error: (err) => {
          console.error('error al cargar Usuarios', err);
          this.isLoadingResults = false;
          this.dataSource.data = [];
          this.swalAlertService.showError('Error al cargar los usuarios');
        },
      });
  }

  createCustomFilterPredicate(): (
    data: UsuariosData,
    filter: string
  ) => boolean {
    return (data: UsuariosData, filter: string): boolean => {
      const dataStr = (
        data.nombre +
        data.apellido +
        data.correo +
        data.estado
      ).toLocaleLowerCase();
      return dataStr.includes(filter);
    };
  }

  openDialog(userId: number | null) {
    if (userId) {
      this.isLoadingResults = true;
      this.usuarioService
        .getUsuarioById(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user: User) => {
            this.isLoadingResults = false;
            const dialogRef = this.dialog.open(FormUsuarioComponent, {
              width: '600px',
              data: { user: user },
            });
          },
          error: (err) => {
            this.isLoadingResults = false;
            console.error('Error fetching full user for edit:', err);
            this.swalAlertService.showError(
              'Error',
              'No se pudo cargar los detalles completos del usuario para editar.'
            );
          },
        });
    } else {
      console.log('Opening dialog for new user (creation mode).');
      this.openFormDialog(null);
    }
  }

  openFormDialog(user: User | null): void {
    const dialogref = this.dialog.open(FormUsuarioComponent, {
      data: user,
      width: '600px',
      disableClose: true,
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

  eliminarUsuario(usuario: UsuariosData): void {
    this.swalAlertService.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.usuarioService
          .deleteUSer(usuario.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response: DeleteResponse) => {
              this.swalAlertService.showSuccess(response.message, 'Eliminado!');
              this.refreshTable();
            },
            error: (err: any) => {
              console.error(
                `Error al eliminar el usuario con id ${usuario.id}:`,
                err
              );
              let errorMessage =
                'No se pudo eliminar el usuario. Intente de nuevo';
              if (err.error && err.error.message) {
                errorMessage = err.error.message;
              } else if (err.message) {
                errorMessage = err.message;
              } else if (err.status) {
                errorMessage = `Error ${err.status}: ${
                  err.statusText || 'Error desconocido'
                }`;
              }
              this.swalAlertService.showError(errorMessage);
              this.refreshTable();
            },
          });
      }
    });
  }

  refreshTable() {
    this.obtenerListaUsuarios();
  }
  ngOnInit(): void {
    this.obtenerListaUsuarios();
    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.dataSource.filter = value ? value.trim().toLocaleLowerCase() : '';
      });
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
