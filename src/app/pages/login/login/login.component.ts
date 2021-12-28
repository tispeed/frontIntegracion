import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { Login } from 'src/app/core/models/login.model';
import { AuthService } from "src/app/core/services/auth.service";
import { NotificationService } from "src/app/core/services/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "login.component.html",
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public loginData:Login = new Login();
    constructor(
        public spinner: NgxSpinnerService, 
        public router: Router,
        public authService: AuthService,
        public notificationService: NotificationService,
        ) {}

    ngOnInit() {
        this.removeLocalStorageItems();
    }
    removeLocalStorageItems(){
        localStorage.clear();
      }
      login() {
        this.spinner.show()
        this.authService.login(this.loginData).toPromise().then(
          response => {
            if(response!=undefined && response.data){
              localStorage.setItem('access_token', response.data.token);
              localStorage.setItem('expires_in', response.data.exp);
              localStorage.setItem('user', JSON.stringify(response.data.user));
              this.spinner.hide();
              this.notificationService.showSuccess('Operación realiza exitosamente',response.data.message)
              this.router.navigate(['/admin/']);
            }
          }).catch(error =>{
            this.spinner.hide();
            if(error.error)
              this.notificationService.showError('Error',error.error) 
            console.log("error:",error)
          }
        )
      }
}
