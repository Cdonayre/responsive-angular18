import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalAlertService {
  confirmDelete() {
    return Swal.fire({
      title: 'Estás seguro?',
      text: 'No se podrá revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#131921',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
    });
  }

  showSuccess(message: string,title:string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#131921',
      confirmButtonText: 'Aceptar',
    });
  }

  showError(message: string,title='Error!') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#131921',
      confirmButtonText: 'Aceptar',
    });
  }

  showAdvertence(message: string) {
    Swal.fire({
      title: 'Advertencia!',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#131921',
    });
  }
}
