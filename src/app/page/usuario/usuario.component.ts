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
  User,
  UserService,
  UsuarioSistemas,
} from '../../services/user.service';
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
import { Subject, takeUntil } from 'rxjs';
import { getSpanishPaginatorIntl } from '../../helper/general-function';
import { FormUsuarioComponent } from './form-usuario/form-usuario.component';
import { SwalAlertService } from '../../services/swal-alert.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Sistemas } from '../sistemas/models/sistemas.model';
import { SistemasService } from '../../services/sistemas.service';
import { HttpErrorResponse } from '@angular/common/http';


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
  private sistemasService= inject(SistemasService);

  sistemaSeleccionado:number=0;
  sistemas: Sistemas[]=[];
  //rolSeleccionado: number = 0; // 0: admin, 1: usuario normal
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'dni',
    'nombre',
    'apellido',
    'nombre_usuario',
    'correo',
    'actions',
  ];
  resultLength = 0;
  isLoadingResults = true;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  cargarUsuariosSistemas(): void {
    this.isLoadingResults = true;
    this.usuarioService
      .getUsuariosSistemas(this.sistemaSeleccionado)
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

  cargarListaSistemas():void{
    this.isLoadingResults=true;
    this.sistemasService.getSistemas()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Sistemas[])=>{
        this.sistemas =[{id:0, nombre:'ninguno', descripcion:'Selecciona una opción'},
          ...data]
        this.isLoadingResults=false;
        this.cargarUsuariosFiltradosPorSistema();
        },
         error: (err: HttpErrorResponse) => {
        this.isLoadingResults = false;
        console.error('Error al cargar datos de filtros:', err);
        this.swalAlertService.showError(
          'Error de Carga',
          'No se pudieron cargar los datos de sistemas y roles para los filtros.'
        );
        this.sistemas = [{ id: 0, nombre: 'Todos', descripcion: 'Error al cargar sistemas' }];
          this.cargarUsuariosFiltradosPorSistema();
      },
    });
  }
  cargarUsuariosFiltradosPorSistema():void{
    this.isLoadingResults=true;
    this.usuarioService
    .getUsuariosSistemas(this.sistemaSeleccionado)
    .pipe(takeUntil(this.destroy$)
    ).subscribe({
      next: (data:User[])=>{
        this.dataSource.data=data;
        this.resultLength= data.length;
        this.isLoadingResults= false;
        console.log('usuarios cargados. ', this.dataSource);
      },
      error: (err)=>{
        console.error('Error al cargar los usuarios al sistema: ',err);
        this.isLoadingResults=false;
        this.dataSource.data= [];
        this.swalAlertService.showError('Error al cargar el sistema');
      },
    });
  }
  constructor() {}


  onSistemasChange(event: any):void{
    this.sistemaSeleccionado = event.value;
    console.log('Sistema seleccionado', this.sistemaSeleccionado);
    this.cargarUsuariosFiltradosPorSistema();
  }
  ngOnInit(): void {
    this.cargarListaSistemas();
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
  openDialog(user: User | null) {
    const dialogref = this.dialog.open(FormUsuarioComponent, {
      data: {
        user: user,
        defaultSistemaId: user=== null? this.sistemaSeleccionado: undefined
      },
      width: '600px',
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
    this.cargarUsuariosFiltradosPorSistema();
  }

  eliminarUser(user: User): void {
    this.swalAlertService.confirmDelete().then((result) => {
      if (result.isConfirmed) {
        this.usuarioService
          .deleteUSer(user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response: DeleteResponse) => {
              this.swalAlertService.showSuccess(response.message, 'Eliminado!');
              this.refreshTable();
            },
            error: (err: any) => {
              console.error(
                `Error al eliminar el usuario con id ${user.id}:`,
                err
              );
              const errorMessage =
                err.message ||
                'No se pudo eliminar el usuario. Intente de nuevo';
              this.swalAlertService.showError(errorMessage);
            },
          });
      }
    });
  }
}
