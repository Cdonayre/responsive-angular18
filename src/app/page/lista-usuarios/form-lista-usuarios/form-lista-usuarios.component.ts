import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SwalAlertService } from '../../../services/swal-alert.service';
import { Roles, User, UserService, UsuarioCrear, UsuarioSistemas, UsuarioUpdate } from '../../../services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-form-lista-usuarios',
  standalone: true,
  imports: [    MatDialogModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatIconModule,
      MatDialogTitle,
      MatSelectModule,
      MatDialogContent,
      MatDialogActions,
      MatIconButton,
      MatIcon,
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      CommonModule,],
  templateUrl: './form-lista-usuarios.component.html',
  styleUrl: './form-lista-usuarios.component.css'
})
export class FormListaUsuariosComponent implements OnInit, OnDestroy {

  private closeDialogRef = inject(MatDialogRef<FormListaUsuariosComponent>);
  private fb= inject(FormBuilder);
  private swalAlertService = inject(SwalAlertService);
  private usuarioService = inject(UserService);
  userForm!: FormGroup;
    public availableRoles: Roles[] = [
  //Renamed from availableSystems
      { id: 0, descripcion: 'Ninguno' },
      { id: 1, descripcion: 'Administrador' },
      { id: 2, descripcion: 'Supervisor' },
      { id: 3, descripcion: 'Empleado' },
    ];
    isEditMode = false;
    passwordChanged = false;
    private destroy$ = new Subject<void>();
    availableSystem: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: User | null){}



  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initForm();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

initForm(): void {

    const initialRoleId = this.data ? (this.data as any).id_rol : 0;
    this.userForm = this.fb.group({
      id_usuario: [this.data ? this.data.id_usuario : null],
      dni: [
        {
          value: this.data ? this.data.dni : '',
          disabled: this.isEditMode,
        },
        Validators.required,
      ],
      nombre: [this.data ? this.data.nombre : '', Validators.required],
      apellido: [this.data ? this.data.apellido : '', Validators.required],
      nombre_usuario: [
        this.data ? this.data.nombre_usuario : '',
        Validators.required,
      ],
      correo: [
        this.data ? this.data.correo : '',
        [Validators.required, Validators.email],
      ],
      clave: ['', this.isEditMode ? [] : Validators.required],
      sistema_id: [initialRoleId, Validators.required],
    });

    if (!this.isEditMode && initialRoleId === 0) {
      this.userForm.get('sistema_id')?.setValue(0);
    }
    if (this.isEditMode) {
      this.userForm
        .get('clave')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.passwordChanged = !!value;
        });
    }
  }

  loadFormDataForEdit(user: UsuarioSistemas): void {
    this.userForm.patchValue({
      id: user.id_usuario,
      dni: user.dni,
      nombre: user.nombre,
      apellido: user.apellido,
      nombre_usuario: user.nombre_usuario,
      correo: user.correo,
    });

    this.userForm.get('dni')?.disable();
    this.userForm.get('clave')?.setValidators([]); // Eliminar la validación de clave en modo edición
    this.userForm.get('clave')?.updateValueAndValidity(); // Actualizar la validez del campo clave

    this.userForm.get('clave')?.valueChanges.subscribe((value) => {
      this.passwordChanged = !!value;
    });
  }

  closeDialog() {
    this.closeDialogRef.close();
  }

  addOrEdit(): void {
    if (this.isEditMode && this.userForm.get('dni')?.disabled) {
      this.userForm.get('dni')?.enable();
    }

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();

      if (
        this.isEditMode &&
        this.userForm.get('dni')?.enabled &&
        !this.userForm.get('dni')?.disabled
      ) {
        this.userForm.get('dni')?.disable();
      }
      this.swalAlertService.showError(
        'Formulario Incompleto',
        'Por favor, complete todos los campos requeridos.'
      );
      console.error('Formulario inválido:', this.userForm.errors);
      return;
    }

    const rawFormData = this.userForm.getRawValue();

    if (this.isEditMode) {
      const userId = rawFormData.id_usuario;
      if (!userId) {
        console.error('Erro: no hay User Id para actualizar');
        this.swalAlertService.showError(
          'Error',
          'No se puede obtener el ID del usuario para actualzar'
        );
        return;
      }

      const formDataForUpdate: UsuarioUpdate = {
        dni: rawFormData.dni,
        nombre: rawFormData.nombre,
        apellido: rawFormData.apellido,
        nombre_usuario: rawFormData.nombre_usuario,
        correo: rawFormData.correo,
        ...(this.passwordChanged && rawFormData.clave
          ? { clave: rawFormData.clave }
          : {}),
      };

      console.log('Se va a actualizar el usuario:', formDataForUpdate);
      this.usuarioService.putUsuario(userId, formDataForUpdate).subscribe({
        next: (response: User) => {
          console.log('Usuario actualizado con éxito:', response);
          this.swalAlertService.showSuccess(
            'Se ha actualizado el usuario correctamente',
            'Actualización Exitosa'
          );
          this.closeDialogRef.close(true);
        },
        error: (err: any) => {
          console.error('Erro al actualizar usuario:', err);
          const errorMessage =
            err.message || 'No se pudo actualizar el usuario';
          this.swalAlertService.showError(errorMessage, 'Error al actualizar');
        },
      });
    } else {
      delete rawFormData.id_usuario;

      const sistemaIdValue = this.userForm.get('sistema_id')?.value;
      const claveValue = this.userForm.get('clave')?.value;

      const formDataForCreate: UsuarioCrear = {
        dni: rawFormData.dni,
        nombre: rawFormData.nombre,
        apellido: rawFormData.apellido,
        nombre_usuario: rawFormData.nombre_usuario,
        correo: rawFormData.correo,
        clave: claveValue,
        sistema_id: sistemaIdValue,
      };

      console.log('Se va a crear el usuario.', formDataForCreate);
      this.usuarioService.postUsuario(formDataForCreate).subscribe({
        next: (response: UsuarioCrear) => {
          console.log('Se ha creado el usuario con exito:', response);
          this.swalAlertService.showSuccess(
            'Se ha creado el usuario correctamente',
            'Creación Exitosa'
          );
          this.closeDialogRef.close(true);
        },
        error: (err: any) => {
          console.error('Error al crear usuario: ', err);
          const errorMessage = err.message || 'No se pudo crear el usuario';
          this.swalAlertService.showError(errorMessage);
        },
      });
    }
    if (this.isEditMode && this.userForm.get('dni')?.enabled) {
      this.userForm.get('dni')?.disable();
    }
  }

  getRoleName(roleId: number | null): string {
    if (roleId === null || roleId === undefined) return '';
    const role = this.availableRoles.find(r => r.id === roleId);
    return role ? role.descripcion : 'Desconocido';
  }
  onCancel(): void {
    this.closeDialogRef.close(false);
  }

}
