import { Component, inject, OnInit, ɵINTERNAL_APPLICATION_ERROR_HANDLER } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  UserService,
  UsuarioCrear,
  UsuarioSistemas,
} from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { SwalAlertService } from '../../../services/swal-alert.service';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [
    MatDialogModule,
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
    CommonModule,
  ],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css',
})
export class FormUsuarioComponent implements OnInit {
  private closeDialogRef = inject(MatDialogRef<FormUsuarioComponent>);
  private fb = inject(FormBuilder);
  private swalAlertService = inject(SwalAlertService);
  private usuarioService = inject(UserService);
  public initialUserData: UsuarioSistemas | null = inject(MAT_DIALOG_DATA);

  userForm: FormGroup = this.fb.group({
    id: [0],
    dni:['',Validators.required],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    nombre_usuario: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    clave:['', Validators.required],
  });
  isEditMode = false;
  passwordChanged = false;

  constructor() {}

  ngOnInit(): void {
    if (this.initialUserData) {
      this.isEditMode = true;
      this.loadFormDataForEdit(this.initialUserData);
    }
  }

   loadFormDataForEdit(user: UsuarioSistemas): void {
    this.userForm.patchValue({
      id: user.id_usuario,
      dni: user.dni,
      nombre: user.nombre,
      apellido: user.apellido,
      nombre_usuario: user.nombre_usuario,
      correo: user.correo
    });

    this.userForm.get('dni')?.disable();
    this.userForm.get('clave')?.setValidators([]); // Eliminar la validación de clave en modo edición
    this.userForm.get('clave')?.updateValueAndValidity(); // Actualizar la validez del campo clave

    this.userForm.get('clave')?.valueChanges.subscribe(value =>{
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

      if (this.isEditMode && this.userForm.get('dni')?.enabled) {
        this.userForm.get('dni')?.disable();
      }
    this.swalAlertService.showError('Formulario Incompleto', 'Por favor, complete todos los campos requeridos.');
      console.error('Formulario inválido:', this.userForm.errors);
      return;
    }

    const formData: UsuarioCrear = this.userForm.getRawValue();

    if (this.isEditMode) {
      if (!this.passwordChanged || !formData.clave) {
        delete formData.clave;
      }
    } else {
      delete formData.id; // Asegurarse de que el ID no se envíe al crear un nuevo usuario
    }

    if (this.isEditMode) {
      console.log('Se va a actualizar el usuario: ', formData);
      this.usuarioService.putUsuario(formData).subscribe({
        next: (data) => {
          console.log('Actualizado con exito', data);
          this.swalAlertService.showSuccess('Se ha actualizado el usuario correctamente', 'Actualización Exitosa');
          this.closeDialogRef.close(true);
        },
      });
    } else {
      console.log('Se va a crear el usuario: ', formData);
      this.usuarioService.postUsuario(formData).subscribe({
        next: (data) => {
          console.log('Se ha creado el usuario con exito', data);
          this.swalAlertService.showSuccess('Se ha creado el usuario correctamente', 'Creación Exitosa');
          this.closeDialogRef.close(true); // Close after user acknowledges
          
        },
        error: (err) => {
          console.error('Error al crear usuario: ', err);
          this.swalAlertService.showError('No se pudo crear el usuario');
        },
      });
    }
    if (this.isEditMode && this.userForm.get('dni')?.enabled) {
      this.userForm.get('dni')?.disable();
    }
  }
  onCancel(): void {
    this.closeDialogRef.close(false);
  }
}
