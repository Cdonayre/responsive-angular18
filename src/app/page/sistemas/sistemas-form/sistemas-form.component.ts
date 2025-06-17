import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, takeUntil } from 'rxjs';
import { SistemasService } from '../../../services/sistemas.service';
import { SwalAlertService } from '../../../services/swal-alert.service';
import SistemasComponent from '../sistemas.component';
import { Sistemas, Sistema } from '../models/sistemas.model';

@Component({
  selector: 'app-sistemas-form',
  standalone: true,
  imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule
  ],
  templateUrl: './sistemas-form.component.html',
  styleUrl: './sistemas-form.component.css'
})
export class SistemasFormComponent implements OnInit, OnDestroy {
  sistemaForm!: FormGroup;
  isEditing: boolean= false;
  private destroy$ = new Subject<void>();

  private fb= inject(FormBuilder);
  private SistemasService= inject(SistemasService);
  private swalAlertService = inject(SwalAlertService);



  constructor( public dialogRef: MatDialogRef<SistemasComponent>,
  @Inject(MAT_DIALOG_DATA) public data: Sistemas){}



  ngOnInit(): void {
    this.isEditing= !!this.data && this.data.id !== undefined;
    this.iniciarFormulario();
    if(this.isEditing){
      this.sistemaForm.patchValue(this.data);
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  iniciarFormulario(){
    this.sistemaForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    if(this.isEditing){
      this.sistemaForm.controls['id'].disable();
    }
  }

  onSubmit():void{
    if(this.sistemaForm.invalid){
      this.sistemaForm.markAllAsTouched();
      this.swalAlertService.showError('Formulario inválido', 'complete los datos requeridos');
      return;
    }

    const formData: Sistemas={
      nombre: this.sistemaForm.value.nombre,
      descripcion: this.sistemaForm.value.descripcion
    };
    if(this.isEditing){
      const sistemaId = this.data.id!;
      this.SistemasService.actualizarSistema(sistemaId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ()=>{
          this.dialogRef.close(true);
        },
        error: (err) =>{
          console.error(`Error al actualziar`, err);
          this.swalAlertService.showError(`Erroral actualizar`, err.message || 'Ocurrió un error.');
        }
      });
    }else{
      this.SistemasService.crearSistema(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ()=>{
          this.dialogRef.close(true);
        },
        error: (err)=>{
          console.error('Error al crear', err);
          this.swalAlertService.showError('Error al crear',err.message ||'Ocurrió un error');
        }
      });
    }
  }

  onCancel():void{
    this.dialogRef.close();
  }
}
