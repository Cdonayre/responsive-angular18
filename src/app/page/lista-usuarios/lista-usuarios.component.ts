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
import { MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { FormUsuarioComponent } from '../usuario/form-usuario/form-usuario.component';

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
    ReactiveFormsModule
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
  filterControl= new FormControl('');
  constructor(){}


  obtenerListaUsuarios(): void {
    this.isLoadingResults=true;
    this.usuarioService
      .getListaUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: UsuariosData[]) => {
          this.dataSource.data = data;
          this.isLoadingResults = false;
          this.resultLength = data.length;
          //filtro dinamico
          this.dataSource.filter =this.filterControl.value ? this.filterControl.value.trim().toLocaleLowerCase(): '';
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


  createCustomFilterPredicate():(data: UsuariosData, filter:string)=> boolean{
    return (data:UsuariosData, filter: string): boolean=>{
      const dataStr= (data.nombre+data.apellido+data.correo+data.estado).toLocaleLowerCase();
      return dataStr.includes(filter);
    };
  }
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

  eliminarUsuario(usuario: UsuariosData):void{
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
                  const errorMessage =
                    err.message ||
                    'No se pudo eliminar el usuario. Intente de nuevo';
                  this.swalAlertService.showError(errorMessage);
                  this.refreshTable();
                },
              });
          }
        });

  }

  refreshTable(){
    this.obtenerListaUsuarios();
  }
  ngOnInit(): void {
    this.obtenerListaUsuarios();
    this.filterControl.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(value=>{
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
