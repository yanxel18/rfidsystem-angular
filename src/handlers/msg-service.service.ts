import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class MsgServiceService {
  public messages: string | undefined;
  public LoadSuccess: boolean = true;
 
 
  public generalMessageError(message: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
    });
    Toast.fire({
      icon: 'error',
      title: 'エラーメッセージ',
      text: `${message}`,
      timerProgressBar: true, 
      didClose: () => {
        window.location.reload();
      }
    });

    　
  }
  constructor() { }
}