import { Rol, RolData } from './models/roles.model';
import { AfterViewInit, Component, OnInit,OnDestroy, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwalAlertService } from '../../services/swal-alert.service';
import { RolesService } from '../../services/roles.service';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DeleteResponse, UsuarioSistemas } from '../../services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule,MatIcon,MatTableModule,MatProgressSpinnerModule,MatPaginator ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export default class RolesComponent implements OnInit, OnDestroy, AfterViewInit {
  // Define any properties or methods needed for the component
  readonly dialog = inject (MatDialog);
  private swalAlertService = inject(SwalAlertService);
  private rolesService= inject(RolesService);
  private destroy$ = new Subject<void>();
  public dataSource= new MatTableDataSource<RolData>()
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];

  resultLenght: number = 0;
  isLoadingResults: boolean = true;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  cargarRoles(): void{
    this.isLoadingResults = true;
    this.rolesService.getRoles().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: RolData[]) => {
        this.dataSource.data = data;
        this.resultLenght = data.length;
        this.isLoadingResults = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.swalAlertService.showError('Error al cargar los roles');
        this.isLoadingResults = false;
      }
    });
  }




eliminarRol(rolId: RolData):void{
  this.swalAlertService.confirmDelete().then((result)=>{
    if(result.isConfirmed){
this.rolesService
.eliminarRol(rolId.id)
.pipe(takeUntil(this.destroy$))
.subscribe({
  next: (response: DeleteResponse)=>{
    this.swalAlertService.showSuccess(
      response.message,'Eliminado!'
    );
    this.refreshTable();
  },
  error:(err:any)=>{
    console.error(`Error al eliminar el usuario con id ${rolId.id}:`, err);
    const errorMessage = err.message || 'No se pudo eliminar el rol';
    this.swalAlertService.showError(errorMessage);
  },
});
    }
  });
}

  constructor() {}

  ngOnInit(): void {
    // Initialization logic here
  }

  ngOnDestroy(): void {
    this.cargarRoles();
  }

  // Add any additional methods or properties as needed,

  ngAfterViewInit(): void {
    // Logic to run after the component's view has been initialized
  }
  refreshTable():void {
    this.cargarRoles();
  }
}

