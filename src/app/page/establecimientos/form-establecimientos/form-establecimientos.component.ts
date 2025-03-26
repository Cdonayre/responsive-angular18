import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EstablecimientosEdit, EstablecimientosService } from '../../../services/establecimientos.service';
import EstablecimientosComponent from '../establecimientos.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-establecimientos',
  standalone: true,
  imports: [MatDialogModule,MatDialogTitle, MatDialogContent,MatDialogActions,MatIconButton,MatIcon,MatFormFieldModule,MatInputModule,FormsModule, CommonModule],
  templateUrl: './form-establecimientos.component.html',
  styleUrl: './form-establecimientos.component.css'
})
export default class FormEstablecimientosComponent {
  readonly dialogref=inject(MatDialogRef<EstablecimientosComponent>)
  establecimientoData=inject<EstablecimientosEdit>(MAT_DIALOG_DATA);

  constructor(private establecimeintoService:EstablecimientosService){}


  
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
      this.establecimeintoService.putEstablecimiento(establecimiento).subscribe({
        next:(data)=>{
          console.log("Se ha actualizado el usuario");
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
  }
}
