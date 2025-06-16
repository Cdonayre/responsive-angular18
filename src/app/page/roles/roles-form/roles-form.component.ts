import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SwalAlertService } from '../../../services/swal-alert.service';
import { RolesService } from '../../../services/roles.service';
import { Subject, takeUntil } from 'rxjs';
import { Rol, RolData } from '../models/roles.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MessageCardComponent } from '../../../shared/message-card/message-card.component';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // For reactive forms
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './roles-form.component.html',
  styleUrl: './roles-form.component.css'
})
export class RolesFormComponent implements OnInit, OnDestroy{
  roleForm!: FormGroup;
  isEditing: boolean= false;
  private destroy$ = new Subject<void>();

  private fb= inject(FormBuilder);
  private rolService = inject(RolesService);
  private SwalAlertService = inject(SwalAlertService);

  constructor(
    public dialogRef: MatDialogRef<RolesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data:RolData
  ){}

  ngOnInit(): void {
    this.isEditing = !!this.data;
    this.iniciarFormulario();
    if(this.isEditing){
      this.roleForm.patchValue(this.data);
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  iniciarFormulario(){
    this.roleForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['',Validators.required]
    });
    if(this.isEditing){
      this.roleForm.controls['id'].disable();
    }
  }

  onSubmit():void{
    if(this.roleForm.invalid){
      this.roleForm.markAllAsTouched();
      this.SwalAlertService.showError('Formulario inválido', 'Completar losdatos requeridos');
      return;
    }

    const formData: Rol={
      nombre: this.roleForm.value.nombre,
      descripcion: this.roleForm.value.descripcion
    };
    if(this.isEditing){
      const rolId = this.data.id
      this.rolService.actualizaRoles(rolId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ()=>{
          this.dialogRef.close(true);
        },
        error: (err)=>{
          console.error('Error al actualizar el Rol', err);
          this.SwalAlertService.showError('Error al actualziar el Rol', err.message|| 'Ocurrió un error.');
          this.dialogRef.close();
        }
      });
    }else{
      this.rolService.crearRoles(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ()=>{
          this.dialogRef.close(true);
        },
        error: (err)=>{
          console.error('Error al crear el Rol', err);
          this.SwalAlertService.showError('Error al crear el Rol', err.message || 'Ocurrió un error');
          this.dialogRef.close();
        }
      });
    }
  }
  onCancel():void{
    this.dialogRef.close();
  }

}
