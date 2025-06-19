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
import { Roles, User, UserService, UsuarioCrear, UsuarioUpdate } from '../../../services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { FormUsuarioComponent } from '../../usuario/form-usuario/form-usuario.component';

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
private closeDialogRef = inject(MatDialogRef<FormUsuarioComponent>);
  private fb = inject(FormBuilder);
  private swalAlertService = inject(SwalAlertService);
  private usuarioService = inject(UserService);
  userForm!: FormGroup;

  public availableRoles: Roles[] = [
    { id: 0, descripcion: 'Ninguno' },
    { id: 1, descripcion: 'Administrador' },
    { id: 2, descripcion: 'Supervisor' },
    { id: 3, descripcion: 'Empleado' },
  ];

  isEditMode = false;
  passwordChanged = false;
  private destroy$ = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: {user:User | null}) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data && !!this.data.user;
        console.log('FormUsuarioComponent: isEditMode =', this.isEditMode);
    console.log('FormUsuarioComponent: Data received:', this.data);
    if (this.isEditMode) {
        console.log('FormUsuarioComponent: User object for patching:', this.data.user);
        console.log('FormUsuarioComponent: id_usuario in received user:', this.data.user?.id);
    }
    this.initForm();

    if (this.isEditMode && this.data.user) {
      this.userForm.patchValue(this.data.user);
      console.log('FormUsuarioComponent: Form value AFTER patchValue:', this.userForm.getRawValue());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    const userToPatch = this.isEditMode ? this.data.user : null;

    const initialRoleId = userToPatch ? userToPatch.id_rol : 0;
    this.userForm = this.fb.group({
      id_usuario: [userToPatch ? userToPatch.id : null],
      dni: [
        {
          value: userToPatch ? userToPatch.dni : '',
          disabled: this.isEditMode,
        },
        Validators.required,
      ],
      nombre: [userToPatch ? userToPatch.nombre : '', Validators.required],
      apellido: [userToPatch ? userToPatch.apellido : '', Validators.required],
      nombre_usuario: [
        userToPatch ? userToPatch.nombre_usuario : '',
        Validators.required,
      ],
      correo: [
        userToPatch ? userToPatch.correo : '',
        [Validators.required, Validators.email],
      ],
      clave: ['', this.isEditMode ? [] : Validators.required],
      sistema_id: [initialRoleId],
    });
    if (this.isEditMode) {
      this.userForm
        .get('clave')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.passwordChanged = !!value;
        });
    }
  }
  closeDialog() {
    this.closeDialogRef.close();
  }

  addOrEdit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.swalAlertService.showError(
        'Formulario Incompleto',
        'Por favor, complete todos los campos requeridos.'
      );
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
      };
       if (this.passwordChanged && rawFormData.clave) {
        formDataForUpdate.clave = rawFormData.clave;
      }
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

      const formDataForCreate: UsuarioCrear = {
        dni: rawFormData.dni,
        nombre: rawFormData.nombre,
        apellido: rawFormData.apellido,
        nombre_usuario: rawFormData.nombre_usuario,
        correo: rawFormData.correo,
        clave: rawFormData.clave,
      };

            if (rawFormData.sistema_id !== 0) {
        formDataForCreate.sistema_id = rawFormData.sistema_id;
      }

      console.log('Se va a crear el usuario.', formDataForCreate);
      this.usuarioService.postUsuario(formDataForCreate).subscribe({
        next: (response: UsuarioCrear) => {
          console.log('Se ha creado el usuario con exito:', response);
          this.swalAlertService.showSuccess(
            'Creación Exitosa',
            'Se ha creado el usuario correctamente'
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
