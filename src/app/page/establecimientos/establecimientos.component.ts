import { AfterViewInit, Component, Inject, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { EstablecimientosEdit, EstablecimientosService } from '../../services/establecimientos.service';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog,MatDialogModule} from '@angular/material/dialog';
import FormEstablecimientosComponent from './form-establecimientos/form-establecimientos.component';
import Swal from 'sweetalert2';
import { Ris, RisService } from '../../services/ris.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';

interface EstablecimientoDisplay extends EstablecimientosEdit {
  risNombre?: string;
}
@Component({
  selector: 'app-establecimientos',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule,MatTableModule,MatPaginatorModule,MatPaginator,
    FormsModule,MatButtonModule, MatDividerModule, MatIconModule,MatDialogModule,FormEstablecimientosComponent],
  templateUrl: './establecimientos.component.html',
  styleUrl: './establecimientos.component.css'
})
export default class EstablecimientosComponent implements OnInit, AfterViewInit, OnDestroy {


  readonly dialog=inject(MatDialog);
  private establecimientoService=inject(EstablecimientosService);
  private risService= inject(RisService);
  //private router = inject(Router);
  establecimientos: EstablecimientosEdit[] = [];

  establecimiento:EstablecimientosEdit =
  {
    id:0,
    departamento_id:0,
    provincia_id:0,
    distrito_id:0,
    ris_id:0,
    categoria_id:0,
    codigo:'',
    nombre:''
  };

  // nuevoEstablecimiento:Partial<EstablecimientosEdit>= {codigo:'', nombre:''}

  displayedColumns: string []=['numero','codigo', 'risNombre','nombre','actions'];
  establecimientoDataSource = new MatTableDataSource<EstablecimientoDisplay>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //establecimientoCreado: any;
  private risMap: Map<number, string>= new Map();
  private destroy$ = new Subject<void>();
  constructor() {}

  ngOnInit(): void {
    this.loadInitalData();
  }

  ngAfterViewInit(): void {
   this.establecimientoDataSource.paginator = this.paginator;
  }
ngOnDestroy():void {
  this.destroy$.next();
  this.destroy$.complete();
}


loadInitalData():void{
  forkJoin({
    establecimientos: this.establecimientoService.getEstablecimientos(),
    risItems: this.risService.getRis()
  }).pipe(takeUntil(this.destroy$))
  .subscribe({
    next: ({establecimientos, risItems})=> {
      risItems.forEach((ris: Ris) => {
        this.risMap.set(ris.id, ris.nombre);
      });
      this.processAndSetDataSource(establecimientos);
    },
    error:(err)=>{
      console.error('Error al cargar los datos:', err);
      Swal.fire('Error','No se pudo cargar los datos iniciales','error');
    }
  });
}


processAndSetDataSource(establecimientosData:EstablecimientosEdit[]):void{
  const displayData: EstablecimientoDisplay[] = establecimientosData.map(est => ({
    ...est,
    risNombre: this.risMap.get(est.ris_id) || 'N/A'
  }) );
    this.establecimientos=establecimientosData;
    this.establecimientoDataSource = new MatTableDataSource<EstablecimientoDisplay>(displayData);
    this.establecimientoDataSource.paginator = this.paginator;
  }



eliminarEstablecimiento(establecimiento: EstablecimientosEdit) {
  Swal.fire({
    title: "Estás seguro de eliminar el registro?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar!",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      this.establecimientoService.deleteEstablecimiento(establecimiento.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (datos:any) => {
          Swal.fire({
            title: "Eliminado!",
            text: "El registro ha sido eliminado.",
            icon: "success"
          });
          this.refreshTable();
        },
        error: (err:any) => {
          console.error('Error al eliminar el establecimiento:', err);
          Swal.fire({
            title: "Error!",
            text: "No se pudo eliminar el registro.",
            icon: "error"
          });
        }
      });
    }
  });
}


openDialog(establecimiento1: EstablecimientosEdit){
  const dialogref=this.dialog.open(FormEstablecimientosComponent,{
    data:establecimiento1
  })
  dialogref.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(dialogResult=>{
    console.log(`Se ha cerrado`);
    this.refreshTable();
  });
}

refreshTable() {
  this.establecimientoService.getEstablecimientos().pipe(takeUntil(this.destroy$)).subscribe({
    next: (datos: EstablecimientosEdit[]) => {
      this.processAndSetDataSource(datos);
    },
    error: (err:any) => {
      console.error('Error al refrescar la tabla:', err);
      Swal.fire('Error', 'No se pudo refrescar la tabla', 'error');
    }
  });
}

}
