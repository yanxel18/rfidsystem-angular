import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class MsgServiceService {
  public messages: string | undefined;
  public LoadSuccess = true;

  public generalMessage(): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    });
    Toast.fire({
      icon: 'success',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '', // disable popup animation
        icon: '', // disable icon animation
      },
      hideClass: {
        popup: '', // disable popup fade-out animation
      },
      text: `再接続しています。しばらくお待ちください。`,
      timerProgressBar: true,
      didOpen() {
        Toast.showLoading();
      },
      didClose: () => {
        window.location.reload();
      },
    });
  }

  public notFoundMsgBox(message: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: true,
      timer: 5000,
    });
    Toast.fire({
      icon: 'error',
      text: `${message}`,
      timerProgressBar: true,
    });
  }
}
