import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { UserSistemaData } from './models/usuario-sistema.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-usuario-sistema',
  standalone: true,
  imports: [    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    //MatProgressBarModule,
    MatDialogModule ],
  templateUrl: './usuario-sistema.component.html',
  styleUrl: './usuario-sistema.component.css'
})
export class UsuarioSistemaComponent {
  displayedColumns: string[] = ['sistema', 'rol'];
  constructor(
    public dialogRef: MatDialogRef<UsuarioSistemaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserSistemaData
  ){  }
  onClose(): void {
    this.dialogRef.close();
  }

}
