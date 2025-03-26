import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import {MAT_DIALOG_DATA,MatDialog,MatDialogActions,MatDialogClose,MatDialogContent,MatDialogModule,MatDialogRef,MatDialogTitle,} from '@angular/material/dialog';

import FormEstablecimientosComponent from './form-establecimientos/form-establecimientos.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-establecimientos',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule,MatTableModule,MatPaginatorModule,MatPaginator, FormsModule,MatButtonModule, MatDividerModule, MatIconModule,MatDialogModule,FormEstablecimientosComponent],
  templateUrl: './establecimientos.component.html',
  styleUrl: './establecimientos.component.css'
})
export default class EstablecimientosComponent {

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

  nuevoEstablecimeinto:Partial<EstablecimientosEdit>= {codigo:'', nombre:''}  
  //Datatable
  displayedColumns: string []=['codigo','nombre','actions'];
  establecimientoDataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  router = inject(Router);
  establecimientoCreado: any;
  constructor( private establecimientoService:EstablecimientosService) {
   this.establecimientoService.getEstablecimientos().subscribe({
    next: (datos:any) => {
    this.establecimientos = datos;
    //muestra los datos en el datatable
    this.establecimientoDataSource = new MatTableDataSource<any>(datos);
    this.establecimientoDataSource.paginator = this.paginator;
    }, 
    error:(err) =>{
      console.log(err);
    }
  });  
}

getEstablecimientos(){
  this.establecimientoService.getEstablecimientos().subscribe({
    next:(datos)=>{
      console.log("datos cargados");
    },
    error:(err)=>{
      console.log(err);
    }
  })
}

postEstablecimiento(establecimeinto:EstablecimientosEdit){
  this.establecimientoService.postEstablecimiento(establecimeinto).subscribe({
    next:(datos:any)=>{
      this.establecimientoCreado=datos;
      this.establecimientos.push(this.establecimientoCreado);
  },
  error:(err)=>{
    console.log(err);
  }
});
}

eliminarEstablecimiento(establecimiento:EstablecimientosEdit){
  this.establecimientoService.deleteEstablecimiento(establecimiento.id)
  .pipe(switchMap(()=>this.establecimientoService.listaEstablecimientos())
)  .subscribe({
    next:(data)=>{
      console.log("Se ha eliminado el establecimeinto");
    },
    error:(err)=>{
      console.log(err);
    }
  })
}




openDialog(establecimiento1: EstablecimientosEdit){
  console.log(establecimiento1);
  const dialogref=this.dialog.open(FormEstablecimientosComponent,{
    data:establecimiento1
  })
  dialogref.afterClosed().subscribe(result=>{
    console.log(`Se ha cerrado`);
    if(result!==undefined){
      this.establecimiento.id=result.id;
      this.establecimiento.codigo=result.codigo;
      this.establecimiento.nombre=result.nombre;
    }
  });
}
}
