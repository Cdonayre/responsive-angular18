import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import {
  UserSistemaData,
  UserSistemaId,
  UserSistemaPost,
} from './models/usuario-sistema.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Sistemas, Sistema } from '../sistemas/models/sistemas.model';
import { UsuarioSistemaService } from '../../services/usuario-sistema.service';
import { SistemasService } from '../../services/sistemas.service';
import { RolesService } from '../../services/roles.service';
import { SwalAlertService } from '../../services/swal-alert.service';
import { RolData } from '../roles/models/roles.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-usuario-sistema',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinner,
    MatOptionModule,
    MatDividerModule,
    MatSelectModule,
  ],
  templateUrl: './usuario-sistema.component.html',
  styleUrl: './usuario-sistema.component.css',
})
export class UsuarioSistemaComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['sistema', 'rol'];
  isLoading: boolean = true;
  isSaving: boolean = false;
  isCreateMode: boolean = false;
  isAddingNewAssignmentMode: boolean = false;
  showAssignmentForm: boolean = false;
  assignmentForm!: FormGroup;
  availableSystems: Sistemas[] = [];
  filteredAvailableSystems : Sistemas[]=[];
  availableRoles: RolData[] = [];

  private destroy$ = new Subject<void>();
  private usuarioSistemaService = inject(UsuarioSistemaService);
  private sistemasService = inject(SistemasService);
  private rolesService = inject(RolesService);
  private fb = inject(FormBuilder);
  private swalAlertService = inject(SwalAlertService);

  constructor(
    public dialogRef: MatDialogRef<UsuarioSistemaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserSistemaData
  ) {}
  ngOnInit(): void {
    this.isCreateMode =
      !this.data.asignaciones || this.data.asignaciones.length === 0;
      this.initForm();
      if (this.isCreateMode) {
      this.isAddingNewAssignmentMode= true;
      this.loadDropdownData();
    } else {
      this.loadDropdownData();
    }
  }

  initForm(): void {
    this.assignmentForm = this.fb.group({
      sistema_id: [null, Validators.required],
      rol_id: [null, Validators.required],
    });
  }

  loadDropdownData(): void {
    this.isLoading = true;
    forkJoin({
      sistemas: this.sistemasService.getSistemas(),
      roles: this.rolesService.getRoles(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.availableSystems = results.sistemas;
          this.availableRoles = results.roles;
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Error loading dropdown data:', err);
          this.swalAlertService.showError(
            'Error de Carga',
            'No se pudieron cargar los sistemas y roles disponibles.'
          );
        },
      });
  }

  applySystemFilter():void{
    if (this.availableSystems && this.data.asignaciones){
      const assignedSystemIds = new Set(this.data.asignaciones.map(a => a.sistema_id));
      this.filteredAvailableSystems = this.availableSystems.filter(
        sistema => sistema.id != undefined && !assignedSystemIds.has(sistema.id)
      );
    } else{
      this.filteredAvailableSystems = [...this.availableSystems]
    }
  }

  onAddNewAssignment(): void{
    this.isAddingNewAssignmentMode=true;
    this.assignmentForm.reset();
    Object.keys(this.assignmentForm.controls).forEach(key =>{
      this.assignmentForm.get(key)?.markAsUntouched();
      this.assignmentForm.get(key)?.updateValueAndValidity();
    });
  }

  onSave(): void {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      this.swalAlertService.showAdvertence('Formulario Inválido');
      return;
    }

    this.isSaving = true;
    const formValue = this.assignmentForm.value;

    const assignmentData: UserSistemaPost = {
      usuario_id: this.data.usuario_id,
      sistema_id: formValue.sistema_id,
      rol_id: formValue.rol_id,
    };

    this.usuarioSistemaService
      .postUserSistema(assignmentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          this.swalAlertService.showSuccess(
            'Asignación Creada',
            'La asignación de sistema y rol ha sido guardada exitosamente.'
          );

          const selectedSistema = this.availableSystems.find(s => s.id === formValue.sistema_id);
          const selectedRol = this.availableRoles.find(r => r.id === formValue.rol_id);

          // OPTIONAL: Add the new assignment to the local 'data.asignaciones' array
          const newUserSistema: UserSistemaId = {
            // <--- Using UserSistemaId here

            sistema_id: formValue.sistema_id,
            nombre_sistema:
              this.availableSystems.find((s) => s.id === formValue.sistema_id)
                ?.nombre || 'Desconocido',
            rol_id: formValue.rol_id,
            nombre_rol:
              this.availableRoles.find((r) => r.id === formValue.rol_id)
                ?.nombre || 'Desconocido',
          };
          if (!this.data.asignaciones) {
            this.data.asignaciones = [];
          }
          this.data.asignaciones.push(newUserSistema);

          this.assignmentForm.reset();
          this.isAddingNewAssignmentMode = false;

          this.applySystemFilter();
          //this.dialogRef.close(true);
        },
        error: (err: HttpErrorResponse) => {
          this.isSaving = false;
          console.error('Error saving user assignment:', err);
          let errorMessage = 'Hubo un error al guardar la asignación.';
          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }
          this.swalAlertService.showError('Error al Guardar', errorMessage);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
