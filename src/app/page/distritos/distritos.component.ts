import { Component, inject } from '@angular/core';
import { DistritosService, Distritos } from '../../services/distritos.service';

@Component({
  selector: 'app-distritos',
  standalone: true,
  imports: [],
  templateUrl: './distritos.component.html',
  styleUrl: './distritos.component.css'
})
export default class DistritosComponent {
  distritoService = inject(DistritosService);
  distritos: Distritos[] = [];
 
  constructor(){
   this.distritoService.getDistritos().subscribe((datos:any)=>{
     this.distritos=datos
   });
  }
}
