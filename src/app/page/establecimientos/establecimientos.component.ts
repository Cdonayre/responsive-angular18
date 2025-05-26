import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableModule,MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { EstablecimientosEdit, EstablecimientosService } from '../../services/establecimientos.service';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog,MatDialogModule} from '@angular/material/dialog';
import FormEstablecimientosComponent from './form-establecimientos/form-establecimientos.component';
import Swal from 'sweetalert2';
import { RisService } from '../../services/ris.service';
import { forkJoin } from 'rxjs';

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
export default class EstablecimientosComponent implements OnInit, AfterViewInit {


  readonly dialog=inject(MatDialog);
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

  nuevoEstablecimiento:Partial<EstablecimientosEdit>= {codigo:'', nombre:''}  
  //Datatable
  displayedColumns: string []=['numero','codigo', 'risNombre','nombre','actions'];
  establecimientoDataSource = new MatTableDataSource<EstablecimientoDisplay>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  router = inject(Router);
  establecimientoCreado: any;
  private risMap: Map<number, string>= new Map();
  constructor( 
    private establecimientoService:EstablecimientosService,
    private risService: RisService
  ) {}

//    this.establecimientoService.getEstablecimientos().subscribe({
//     next: (datos:any) => {
//     this.establecimientos = datos;
//     //muestra los datos en el datatable
//     this.establecimientoDataSource = new MatTableDataSource<EstablecimientosEdit>(datos);
//     this.establecimientoDataSource.paginator = this.paginator;
//     }, 
//     error:(err) =>{
//       console.log(err);
//     }
//   });  
// }
  ngOnInit(): void {
    this.loadInitalData();
  }

  ngAfterViewInit(): void {
    this.establecimientoDataSource.paginator = this.paginator;
  }


// getEstablecimientos(){
//   this.establecimientoService.getEstablecimientos().subscribe({
//     next:(datos)=>{
//       console.log("datos cargados");
//     },
//     error:(err)=>{
//       console.log(err);
//     }
//   })
// }
loadInitalData():void{
  forkJoin({
    establecimientos: this.establecimientoService.getEstablecimientos(),
    risItems: this.risService.getRis()
  }).subscribe({
    next: ({establecimientos, risItems})=> {
      risItems.forEach(ris => {
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

// postEstablecimiento(establecimeinto:EstablecimientosEdit){
//   this.establecimientoService.postEstablecimiento(establecimeinto).subscribe({
//     next:(datos:any)=>{
//       this.establecimientoCreado=datos;
//       this.establecimientos.push(this.establecimientoCreado);
//   },
//   error:(err)=>{
//     console.log(err);
//   }
// });
// }

processAndSetDataSource(establecimientosData:EstablecimientosEdit[]):void{
  const displayData: EstablecimientoDisplay[] = establecimientosData.map(est => ({
    ...est,
    risNombre: this.risMap.get(est.ris_id) || 'N/A' 
  }) );
    this.establecimientos=establecimientosData;
    this.establecimientoDataSource = new MatTableDataSource<EstablecimientoDisplay>(displayData);
    this.establecimientoDataSource.paginator = this.paginator;
  }   

  postEstablecimiento(establecimientosData:EstablecimientosEdit){
    this.establecimientoService.postEstablecimiento(establecimientosData).subscribe({
      next:(establecimientoCreado:EstablecimientosEdit)=>{
        Swal.fire({
          title:"Creado!",
          text:"El registro ha sido creado",
          icon:"success"
        });
        this.refreshTable();
      },
      error:(err)=>{
        console.error('Error al crear el establecimiento:', err);
        Swal.fire('Error', 'No se pudo crear el registro', 'error');
      }
    });
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
      this.establecimientoService.deleteEstablecimiento(establecimiento.id).subscribe({
        next: (datos) => {
          Swal.fire({
            title: "Eliminado!",
            text: "El registro ha sido eliminado.",
            icon: "success"
          });
          this.refreshTable();
        },
        error: (err) => {
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
 // console.log(establecimiento1);
  const dialogref=this.dialog.open(FormEstablecimientosComponent,{
    data:establecimiento1
  })
  dialogref.afterClosed().subscribe(dialogResult=>{
    console.log(`Se ha cerrado`);
    // if(result!==undefined){
    //   this.establecimiento.id=result.id;
    //   this.establecimiento.codigo=result.codigo;
    //   this.establecimiento.nombre=result.nombre;
    // }
    this.refreshTable();
  });
}

refreshTable() {
  this.establecimientoService.getEstablecimientos().subscribe({
    next: (datos: EstablecimientosEdit[]) => {
      // this.establecimientos = datos;
      // this.establecimientoDataSource.data = datos;
      this.processAndSetDataSource(datos);
    },
    error: (err) => {
      console.error('Error al refrescar la tabla:', err);
      Swal.fire('Error', 'No se pudo refrescar la tabla', 'error');
    }
  });
}

}
