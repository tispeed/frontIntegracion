import { Component, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "src/app/core/services/notification.service";
import { RolsService } from "src/app/core/services/rols.service";
import { ApplicationModulesService } from "src/app/core/services/application-modules.service";
import { Rol } from "src/app/core/models/rol.model";
import { applicationModulesConfigObj, } from "src/app/configs/selects";
import Swal from "sweetalert2";

@Component({
  selector: "app-rols",
  templateUrl: "rols.component.html"
})
export class RolsComponent implements OnInit {
  public modalRef:any=null;
  public headerElements:any[]=[
    'NOMBRE',
    'DESCRIPCIÓN',
  ];
  public rol:Rol=new Rol();
  public roles:Rol[]=[];
  public allRoles:Rol[]=[];
  public totalItems:number=0;
  public searchTable:string=null;
  public applicationModules:any[]=[];
  public applicationModulesConfig:any=applicationModulesConfigObj;
  //form  
  public formData = new FormData();
  constructor(
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private rolsService:RolsService,
    private applicationModulesService:ApplicationModulesService,
		private modalService: BsModalService) {}
  ngOnInit() {
    this.getApplicationModules();
  }
  /* obtencion de datos de formulario */ 
  getFormData(){
    if(this.rol.name)
      this.formData.append("name", `${this.rol.name}`); 
    if(this.rol.description)
      this.formData.append("description", `${this.rol.description}`); 
    if(this.rol.modules)
      this.formData.append("modules", `${JSON.stringify(this.rol.modules)}`); 
    return this.formData;
  }
  getApplicationModules(){
    this.spinner.show();
    this.applicationModulesService.getAll()
    .subscribe(response => {
      if(response.data){
        this.spinner.hide();
        this.applicationModules=response.data;
        this.getRols()
      }
    });
  }
  getRols(){
    this.spinner.show();
    this.rolsService.getAll()
    .subscribe(response => {
      if(response.data){
        this.spinner.hide();
        this.allRoles=response.data.map(e=>{
          e.modules=e.modules.map(m => {
            return m.module;
          })
          return e;
        })
        this.totalItems= this.allRoles.length;
        this.roles = this.allRoles.slice(0, 10);
      }
    });
  }
  setDefaultValues(){
    this.rol=new Rol();
    this.formData = new FormData();
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
    if(this.rol.id){
      this.spinner.show();
      this.rolsService.update(this.rol.id,this.getFormData())
      .subscribe(response => {
        if(response.data){
          this.spinner.hide();
          this.modalRef.hide();
          response.data.modules=response.data.modules.map(m => {
            return m.module;
          })
          this.allRoles=this.allRoles.map(e=>{
            return e.id==response.data.id?response.data:e
          })
          this.roles = this.allRoles.slice(0, 10);
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
      this.rolsService.create(this.getFormData())
      .subscribe(response => {
        if(response.data){
          this.spinner.hide();
          this.modalRef.hide();
          this.allRoles.push(response.data)
          this.totalItems= this.allRoles.length;
          this.roles = this.allRoles.slice(0, 10);
          this.notificationService.showSuccess('Operación realiza exitosamente',response.message)
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
  edit(rol:Rol,content:any){
    this.rol=Object.assign({},rol);      
    this.modalRef=this.modalService.show(content);
  }
  /* eliminacion de elemento por id */ 
  delete(id:number){
    this.rol=this.allRoles.find(element=>{
      return element.id==id?element:null
    })
    Swal.fire({
      title: 'Confirmar operación',
      text: '¿Desea eliminar el rol "'+this.rol.name+'"?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.rolsService.delete(id).toPromise().then(response => {
            if(response!=undefined && response.data){                    
              this.spinner.hide();
              this.allRoles=this.allRoles.filter(element=>{
                if(element.id!=response.data.id){
                  return element
                }
              })
              this.totalItems= this.allRoles.length;
              this.roles = this.allRoles.slice(0, 10);
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
