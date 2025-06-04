import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EstablecimientosEdit, EstablecimientosService } from '../../../services/establecimientos.service';
import EstablecimientosComponent from '../establecimientos.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Ris, RisService } from '../../../services/ris.service';
import { Categorias, CategoriasService } from '../../../services/categorias.service';
import { Distritos, DistritosService } from '../../../services/distritos.service';

@Component({
  selector: 'app-form-establecimientos',
  standalone: true,
  imports: [MatDialogModule,MatDialogTitle,MatSelectModule, MatDialogContent,MatDialogActions,MatIconButton,MatIcon,MatFormFieldModule,MatInputModule,FormsModule, CommonModule],
  templateUrl: './form-establecimientos.component.html',
  styleUrl: './form-establecimientos.component.css'
})
export default class FormEstablecimientosComponent {
  private risService = inject(RisService);
  private categoriaService=inject(CategoriasService);
  private distritoService=inject(DistritosService);
  readonly dialogref=inject(MatDialogRef<EstablecimientosComponent>);
  categorias:Categorias []=[];
  ris: Ris[]  =[];
  distritos: Distritos[] = [];
  
  establecimientoData=inject<EstablecimientosEdit>(MAT_DIALOG_DATA);
  
  constructor(private establecimeintoService:EstablecimientosService,
    public closeDialogRef: MatDialogRef<FormEstablecimientosComponent>
  ){
      this.risService.getRis().subscribe((datos:any)=>{
      this.ris=datos
    });

    this.categoriaService.getCategorias().subscribe((datos:any)=>{
      this.categorias=datos
    });

    this.distritoService.getDistritos().subscribe((datos:any)=>{
      this.distritos=datos
    });
  }

  closeDialog(){
    this.closeDialogRef.close();
  }
  
  addOrEdit(establecimiento:EstablecimientosEdit){
    if(establecimiento.id===0||establecimiento.id===undefined){
      this.establecimeintoService.postEstablecimiento(establecimiento).subscribe({
        next:(data)=>{
          console.log("Se ha creado el usuario");
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }else{
      console.log(establecimiento);
      this.establecimeintoService.putEstablecimiento(establecimiento).subscribe({
        next:(data)=>{
          console.log(data);
          console.log("Se ha actualizado el usuario");
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
  } 
}
