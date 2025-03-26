import { Component, inject } from '@angular/core';
import { Ris, RisService } from '../../services/ris.service';

@Component({
  selector: 'app-ris',
  standalone: true,
  imports: [],
  templateUrl: './ris.component.html',
  styleUrl: './ris.component.css'
})
export default class RisComponent {
  risService = inject(RisService);
  ris: Ris[]=[];

  constructor() {
    this.risService.getRis().subscribe((datos:any)=>{
      this.ris=datos
    });
  }
}
