import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatHeaderCellDef, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SwalAlertService } from '../../services/swal-alert.service';
import { SistemasService } from '../../services/sistemas.service';
import { Subject, takeUntil } from 'rxjs';
import { Sistemas } from './models/sistemas.model';
import { SistemasFormComponent } from './sistemas-form/sistemas-form.component';

@Component({
  selector: 'app-sistemas',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatHeaderCellDef
  ],
  templateUrl: './sistemas.component.html',
  styleUrl: './sistemas.component.css',
})
export default class SistemasComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  readonly dialog = inject(MatDialog);
  private swalAlertService = inject(SwalAlertService);
  private sistemaService = inject(SistemasService);
  private destroy$ = new Subject<void>();
  public dataSource = new MatTableDataSource<Sistemas>();
  //paginación
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'actions'];
  resultLenght: number = 0;
  isLoadingResults: boolean = true;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //methods
  cargarSistemas(): void {
    this.isLoadingResults = true;
    this.sistemaService
      .getSistemas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Sistemas[]) => {
          this.dataSource.data = data;
          this.resultLenght = data.length;
          this.isLoadingResults = false;
          if (this.paginator && !this.dataSource.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (error) => {
          console.error('Error al cargar los sistemas', error);
          this.swalAlertService.showError(
            'Error al cargar los sistemas',
            error.message || 'Ocurrió un error desconocido'
          );
          this.isLoadingResults = false;
        },
      });
  }

  eliminarsistema(sistema: Sistemas): void {
    debugger;
    this.swalAlertService.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.sistemaService
          .eliminarSistema(sistema.id!)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (message: string) => {
              this.swalAlertService.showSuccess(message, 'Eliminado!');
              this.refreshTable();
            },
            error: (err: any) => {
              console.error(
                `Error al eliminar el sistema con el id ${sistema.id}`,
                err
              );
              const errorMessage =
                err.message || 'No se pudo eliminar el sistema';
              this.swalAlertService.showError(errorMessage);
            },
          });
      }
    });
  }

  refreshTable() {
    this.cargarSistemas();
  }
  ngOnInit(): void {
    this.cargarSistemas();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngAfterViewInit(): void {
    if(this.paginator){
      this.dataSource.paginator = this.paginator;
    }
  }

  abrirSistemaFormDialog(sistema?: Sistemas){
    const dialogRef = this.dialog.open(SistemasFormComponent,{
      width:'450px',
      data: sistema ? {...sistema}: null,
    });
    dialogRef
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result)=>{
      if(result){
        this.swalAlertService.showSuccess(
          'Operación exitosa',
          'Se ha creado satisfactoriamente'
        );
        this.refreshTable();
      }
    });
  }
}
