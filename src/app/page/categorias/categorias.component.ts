import { Component, inject } from '@angular/core';
import { Categorias, CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export default class CategoriasComponent {
  categoriasService = inject(CategoriasService);
  categorias: Categorias[] = [];
 
  constructor(){
   
   this.categoriasService.getCategorias().subscribe((datos:any) =>{
     this.categorias = datos
   });
  }
}
