import { Rol, RolData } from './models/roles.model';
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SwalAlertService } from '../../services/swal-alert.service';
import { RolesService } from '../../services/roles.service';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RolesFormComponent } from './roles-form/roles-form.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    RolesFormComponent
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export default class RolesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // Define any properties or methods needed for the component
  readonly dialog = inject(MatDialog);
  private swalAlertService = inject(SwalAlertService);
  private rolesService = inject(RolesService);
  private destroy$ = new Subject<void>();
  public dataSource = new MatTableDataSource<RolData>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'actions'];

  resultLenght: number = 0;
  isLoadingResults: boolean = true;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  cargarRoles(): void {
    this.isLoadingResults = true;
    this.rolesService
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: RolData[]) => {
          this.dataSource.data = data;
          this.resultLenght = data.length;
          this.isLoadingResults = false;
          if (this.paginator && !this.dataSource.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (error) => {
          console.error('Error loading roles:', error);
          this.swalAlertService.showError('Error al cargar los roles', error.message || 'Ocurrió un error desconocido.');
          this.isLoadingResults = false;
        },
      });
  }

  eliminarRol(rol: RolData): void {
    this.swalAlertService.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.rolesService
          .eliminarRol(rol.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (message: string) => {
              this.swalAlertService.showSuccess(message, 'Eliminado!');
              this.refreshTable();
            },
            error: (err: any) => {
              console.error(
                `Error al eliminar el usuario con id ${rol.id}:`,
                err
              );
              const errorMessage = err.message || 'No se pudo eliminar el rol';
              this.swalAlertService.showError(errorMessage);
            },
          });
      }
    });
  }

  constructor() {}

  ngOnInit(): void {
    this.cargarRoles();
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
  refreshTable(): void {
    this.cargarRoles();
  }

  abrirRolFormDialog(rol?: RolData): void {
    const dialogRef = this.dialog.open(RolesFormComponent, {
      width: '450px',
      data: rol ? { ...rol } : null,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result) {
          this.swalAlertService.showSuccess(
            'Operación exitosa',
            'Se ha creado satisfactoriamente'
          );
          this.refreshTable();
        }
      });
  }
}
