import { Component, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "src/app/core/services/notification.service";
import { UsersService } from "src/app/core/services/users.service";
import { RolsService } from "src/app/core/services/rols.service";
import { User } from "src/app/core/models/user.model";
import { rolsConfigObj, } from "src/app/configs/selects";
import Swal from "sweetalert2";

@Component({
  selector: "app-users",
  templateUrl: "users.component.html"
})
export class UsersComponent implements OnInit {
	public modalRef:any=null;
  public headerElements:any[]=[
    'NOMBRE',
    'EMAIL',
  ];
  public user:User=new User();
  public users:User[]=[];
  public allUsers:User[]=[];
  public totalItems:number=0;
  public searchTable:string=null;
  
  public rolsConfig:any=rolsConfigObj;
  public rols:any[]=[];
  constructor(
		private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private usersService:UsersService,
    private rolsService:RolsService,
		private modalService: BsModalService) {}
  ngOnInit() {
    this.getRoles();
  }
  getRoles(){
    this.spinner.show();
    this.rolsService.getAll()
    .subscribe(response => {
      if(response.data){
        this.spinner.hide();
        this.rols = response.data;
        this.getUsers();
      }
    });
  }
  getUsers(){
    this.spinner.show();
    this.usersService.getAll()
    .subscribe(response => {
      if(response.data){
        this.spinner.hide();
        this.allUsers=response.data
        this.totalItems= this.allUsers.length;
        this.users = this.allUsers.slice(0, 10);
      }
    });
  }
  setDefaultValues(){
    this.user=new User();
  }
  /*abre modal*/
	open(content) {
		this.setDefaultValues();
		this.modalRef=this.modalService.show(content);
	}
  /*cierra modal*/
  closeModal(){
    this.modalRef.hide();
  }
  register(){
    if(this.user.id){
      this.spinner.show();
      this.usersService.update(this.user.id,this.user)
      .subscribe(response => {
        if(response.data){
          this.spinner.hide();
          this.modalRef.hide();
          this.allUsers=this.allUsers.map(e=>{ return e.id==response.data.id?response.data:e})
          this.users = this.allUsers.slice(0, 10);
          this.notificationService.showSuccess('Operación realiza exitosamente',response.message)
        }
      },(error)=>{
        console.log("error:",error)
        this.spinner.hide();
        if(error.error)
            this.notificationService.showError('Error',error.error)
      });
    }else{
      this.spinner.show();
      this.usersService.create(this.user)
      .subscribe(response => {
        if(response.data){
          this.spinner.hide();
          this.notificationService.showSuccess('Operación realiza exitosamente',response.message)
          this.modalRef.hide();
          this.allUsers.push(response.data)
          this.totalItems= this.allUsers.length;
          this.users = this.allUsers.slice(0, 10);
        }
      },(error)=>{
        console.log("error:",error)
        this.spinner.hide();
        if(error.error)
            this.notificationService.showError('Error',error.error)
      });
    }
  }
  /*edicion de elemento*/
  edit(user:User,content:any){
    this.user=Object.assign({},user);      
    this.modalRef=this.modalService.show(content);
  }
  /* eliminacion de elemento por id */ 
  delete(id:number){
    this.user=this.allUsers.find(element=>{
      return element.id==id?element:null
    })
    Swal.fire({
      title: 'Confirmar operación',
      text: '¿Desea eliminar el usuario "'+this.user.email+'"?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.usersService.delete(id).toPromise().then(response => {
            if(response!=undefined && response.data){                    
              this.spinner.hide();
              this.allUsers=this.allUsers.filter(element=>{
                if(element.id!=response.data.id){
                  return element
                }
              })
              this.totalItems= this.allUsers.length;
              this.users = this.allUsers.slice(0, 10);
              this.notificationService.showSuccess('Operación realiza exitosamente',response.message)
            }
          }).catch(error => {
            this.spinner.hide();
            if(error.error)
            this.notificationService.showError('Error',error.error)
            console.log("error:",error)   
          });
        }
      this.setDefaultValues();
    })

  }
}
