import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(title, message = ''){
    this.toastr.success(message, title,{
      closeButton: false,
      timeOut:3000,
      enableHtml:true
    })
  }
  showInfo(title, message = ''){
    this.toastr.info(message, title,{
      closeButton: false,
      timeOut:3000,
      enableHtml:true
    })
  }
  showError(title, message = null) {
    if(message instanceof Object) {
      let array_mesages = ''
      for (let message_value of Object.values(message)) {
        array_mesages += message_value+'<br>' 
      }
      message = array_mesages
    }
    this.toastr.error(message, title,{
      closeButton: false,
      timeOut:3000,
      enableHtml:true
    })
  }

  showWarning(title, message = ''){
    this.toastr.warning(message, title,{
      closeButton: false,
      timeOut:3000,
      enableHtml:true
    })
  }
}
