import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root', // Hace que el servicio esté disponible en toda la aplicación
})
export class ConfirmationService {

  confirmAction(action: () => void, message: string = '¿Estás seguro?'): void {
    Swal.fire({
      title: message,
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        action(); 
        Swal.fire({
          title: 'Completado!',
          text: 'La acción se realizó exitosamente.',
          icon: 'success',
          timer: 1000,
        });
      }
    });
  }

  notFound(message: string = 'No se encontraron resultados'): void {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error"
    });
  }
  
  success(message: string = 'Operación exitosa'): void {  
    Swal.fire({
      title: message,
      icon: "success",
      draggable: true
    });
  }

}
