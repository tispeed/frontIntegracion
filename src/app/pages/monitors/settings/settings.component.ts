import { Component, OnInit } from "@angular/core";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgxSpinnerService } from "ngx-spinner";
import { NotificationService } from "src/app/core/services/notification.service";
import { SettingsService } from "src/app/core/services/settings.service";
import { Action } from "src/app/interfaces/action.interface"
import { SortPipe } from "src/app/pipes/sort.pipe";
import * as moment from "moment";
import { actionConfigObj, } from "src/app/configs/selects";

//xlsx
import * as XLSX from "xlsx"; 
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import { GenericFilterPipe } from 'src/app/pipes/generic-filter.pipe';
import { FilterByColumnPipe } from 'src/app/pipes/filter-by-column.pipe';

@Component({
  selector: "app-settings",
  templateUrl: "settings.component.html",
  styleUrls:["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  public dateRange:any[]=[];

  public settings:any[]=[];
  public allSettings:any[]=[];
  public headerElements:any[]=[
    {name:'SELECCIÓN',show_flag:false},
    {name:'ID',show_flag:false},
    {name:'ESTADO_INTEGRACION',show_flag:false},
    {name:'FECHA_TRANSACCION',show_flag:false},
    {name:'CODIGO_CLIENTE',show_flag:false},
    {name:'CANTIDAD',show_flag:false},
    {name:'LOTE',show_flag:false},
    {name:'CONTRATO_ACTUAL',show_flag:false},
    {name:'ESTADO',show_flag:false},
    {name:'ALMACEN_ACTUAL',show_flag:false},
    {name:'TIPO_MOVIMIENTO',show_flag:false},
    {name:'CODIGO_MOTIVO',show_flag:false},
    {name:'MOTIVO',show_flag:false},
    {name:'SKU_GF',show_flag:true},
    {name:'EXPIRACION_LOTE',show_flag:true},
    {name:'FOLIO_GOLDEN_FROST',show_flag:true},
    {name:'DOCNUM',show_flag:true},
    {name:'OBS_REGLA',show_flag:true},
    {name:'OBS_ADMINISTRADOR',show_flag:true},
    {name:'CUENTA_CONTABLE',show_flag:true},
    {name:'RETENER_AJUSTE',show_flag:true},
    {name:'COSTO_PROMEDIO',show_flag:true},
    {name:'ACCIONES',show_flag:false},
  ];  
  public elementFilter: any ={}; 
  public totalItems:number=0;
  public searchTable:string=null;
  public highestToLowest:any={
    movement_type:false,
    expiration_lot:false,
    current_warehouse:false,
    accounting_account:false,
    new_accounting_account:false,
    retain_fit:false,
    average_cost:false,
    OBS_administrator:false,
    integration_status:false,
    id:false,
    comment_rule:false,
    folio_gf:false,
    transaction_date:false,
    docnum:false,
    status:false,
    current_contract:false,
    reason_code:false,
    code:false,
    sku_gf:false,
    lote:false,
    customer_code:false,
  }

  public selected:string=null;

  public modalRef:any=null;

  public showMoreColumnsFlag:boolean=false;
  //excel file
  public data: Array<any>=null;

  public changeStatusData:any={
    ID:null,
    OBS_ADMINISTRADOR:null,
    STATUS:null
  }
  public changeAccountingAccountData:any={
    ID:null,
    CUENTA_CONTABLE:null
  }

  public showMultiActionsFlag:boolean=false;
  public multiActionsFlag:any=null;
  public actionConfig:any=actionConfigObj;
  public actions:any[]=[
    {name:"Liberar",key:"PROCEDE_USU"},
    {name:"Rechazar",key:"RECHAZADO"},
    {name:"Cerrar",key:"CERRADO"},
    {name:"Actualizar cuenta contable",key:"AccountingAccount"},
  ];  
  constructor(
    private modalService: BsModalService,
    private genericFilterPipe:GenericFilterPipe,
    private filterByColumnPipe: FilterByColumnPipe,
    private settingsService:SettingsService,
		private spinner: NgxSpinnerService,
    private notificationService:NotificationService,
    private sortPipe: SortPipe) {}
  ngOnInit() {
    this.setDefaultDateRange()
  }
  setDefaultDateRange(){
    this.dateRange=[moment().utc().subtract(1, 'days').format('MM/DD/yyyy'),moment().utc().format('MM/DD/yyyy')]
    if(this.dateRange[0] && this.dateRange[1]){
      this.getByRangeDate(moment.utc(this.dateRange[0]).format("YYYY-MM-DD"),moment.utc(this.dateRange[1]).format("YYYY-MM-DD"))      
    }
  }
  getByRangeDate(from,to){
    this.spinner.show();
      this.settingsService.getByRangeDate({
        from:from,
        to:to
      })
      .subscribe(response => {
        if(response.data){
          this.spinner.hide();
          this.allSettings=response.data.map(e=> {
            //let index=response.data.indexOf(e)
            //e.ESTADO_INTEGRACION= index==0 || index==3 ?"NO_PROCEDE_REGLA":"PROCESADO"
            //e.ESTADO_INTEGRACION= e.ID=="40786" ?"NO_PROCEDE_REGLA":"PROCESADO"
            e.checked=false
            return e;
          })
          this.totalItems= this.allSettings.length;
          this.settings = this.allSettings.slice(0, 10);
        }
      },(error)=>{
        console.log("error:",error)
      });
  }
  closeModal(){
    this.setDefaultValues();
    if(this.modalRef) this.modalRef.hide();
  }
  /*ordenado de listado por orden alfabetico*/ 
  sortTableBy(element:string){
    const order=this.highestToLowest[element]?"asc":"desc";
    this.settings=this.sortPipe.transform(this.settings, order, element);
    this.highestToLowest[element]=!this.highestToLowest[element];
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.settings = this.allSettings.slice(startItem, endItem);
  }
  onSearchChange($event:any,field:string){
    let object={}
    const keys=!!Object.keys(this.elementFilter).length?Object.keys(this.elementFilter):null;
    if(keys){
      for(let key of keys){
        if(this.elementFilter[key] && this.elementFilter[key]!=''){
          const value={ [key]: this.elementFilter[key] };
          object=Object.assign(this.elementFilter, value);
        }
      }
    }
    if(field){
      const value={ [field]: $event.target.value };
      object=Object.assign(this.elementFilter, value);
  
      this.elementFilter=Object.assign({},object)
    }
    this.settings=(
      (this.searchTable && 
      this.searchTable!='') || ( 
      Object.keys(this.elementFilter).length>0 && 
      Object.values(this.elementFilter).length>0 && 
      Object.values(this.elementFilter).find(e=> e!="")!=undefined))?
      this.allSettings:
      this.allSettings.slice(0, 10);
  }
  changeDateRange(event){
    if(this.dateRange[0] && this.dateRange[1]){
      this.getByRangeDate(moment.utc(this.dateRange[0]).format("YYYY-MM-DD"),moment.utc(this.dateRange[1]).format("YYYY-MM-DD"))
    }
  }
  checkboxChanged(event:any, element_selected:any){
    switch (element_selected) {
      case "all":
        this.allSettings=event.target && event.target.checked?this.allSettings.map(e=>{
          e.checked=true;
          return e;
        }):this.allSettings.map(e=>{
          e.checked=false;
          return e;
        })
        break;  
      default:
        this.allSettings=this.allSettings.map(e =>{
          if(e.ID==element_selected.ID) e.checked = event.target.checked
          return e;
        })
        break;
    }
    this.showMultiActionsFlag=element_selected=="all" &&  !event.target.checked?false:this.multiActionsFlagVerify()
  }
  multiActionsFlagVerify(){
    return this.allSettings.find(e => {
      if(e.ESTADO_INTEGRACION!='NO_PROCEDE_REGLA' && 
      e.ESTADO_INTEGRACION!='PROCEDE_MONITOR' && 
      e.ESTADO_INTEGRACION!='REPROCESO' &&
      e.checked){
        return e
      }
    }) || this.allSettings.filter(e => {
      if(
      e.checked){
        return e
      }
    }).length == 0 ? false : true ;
  }
  selectionChanged(event:any,element:string,templateRef1:any,templateRef2:any){
    if(event && event.value && event.value.key){
      if(event.value.key=="AccountingAccount"){
        this.modalRef=this.modalService.show(templateRef2);
      }else{
        switch (element) {
          case 'action': 
            this.changeStatusData.STATUS=event && event.value && event.value.key?event.value.key:null;
            this.modalRef=this.modalService.show(templateRef1);
            break;            
          default:
            break;
        }
      }
      
    }
    
  }
  /*generacion de reporte en excel*/
  generateReport(){
    const genericFilterPipeTransform = this.searchTable?this.genericFilterPipe.transform(this.settings,this.searchTable):this.allSettings;
    const filterByColumnPipeTransform = this.filterByColumnPipe.transform(genericFilterPipeTransform,this.elementFilter);
    
    const filteredArray = genericFilterPipeTransform.length>=filterByColumnPipeTransform.length?genericFilterPipeTransform.filter(value => filterByColumnPipeTransform.includes(value)):filterByColumnPipeTransform.filter(value => genericFilterPipeTransform.includes(value));
    

    this.data=new Array();
    for(let setting of filteredArray){
       this.data.push({
        SELECCIÓN:setting.SELECCIÓN,
        ESTADO_INTEGRACION:setting.ESTADO_INTEGRACION,
        FECHA_TRANSACCION:setting.FECHA_TRANSACCION,
        CODIGO_CLIENTE:setting.CODIGO_CLIENTE,
        CANTIDAD:setting.CANTIDAD,
        LOTE:setting.LOTE,
        CONTRATO_ACTUAL:setting.CONTRATO_ACTUAL,
        ESTADO:setting.ESTADO,
        ALMACEN_ACTUAL:setting.ALMACEN_ACTUAL,
        TIPO_MOVIMIENTO:setting.TIPO_MOVIMIENTO,
        CODIGO_MOTIVO:setting.CODIGO_MOTIVO,
        MOTIVO:setting.MOTIVO,
        SKU_GF:setting.SKU_GF,
        EXPIRACION_LOTE:setting.EXPIRACION_LOTE,
        FOLIO_GOLDEN_FROST:setting.FOLIO_GOLDEN_FROST,
        DOCNUM:setting.DOCNUM,
        OBS_REGLA:setting.OBS_REGLA,
        OBS_ADMINISTRADOR:setting.OBS_ADMINISTRADOR,
        CUENTA_CONTABLE:setting.CUENTA_CONTABLE,
        RETENER_AJUSTE:setting.RETENER_AJUSTE,
        COSTO_PROMEDIO:setting.COSTO_PROMEDIO,
       });
    }     
    this.exportAsExcelFile(this.data, 'listado-ajustes');
  }
  /*exporta archivo excel*/
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  /* guarda como archivo excel*/
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName +new  Date()+EXCEL_EXTENSION);
  }
  changeStatus(templateRef:any,id:number,status:string){//status = CERRADO || RECHAZADO || LIBERADO
    this.changeStatusData.ID=id;
    this.changeStatusData.STATUS=status;
    this.modalRef=this.modalService.show(templateRef);
  }
  saveChangeStatus(){
    const elementsSelected= this.allSettings.filter(e => {
      if((e.ESTADO_INTEGRACION=='NO_PROCEDE_REGLA' || 
      e.ESTADO_INTEGRACION=='PROCEDE_MONITOR' || 
      e.ESTADO_INTEGRACION=='REPROCESO') && 
      e.checked){
        return e
      }
    })
    if(elementsSelected.length>0){
      for(let element of elementsSelected){
        const notification_flag= (elementsSelected.length==elementsSelected.indexOf(element)+1)?true:false;
        this.changeStatusData.ID=element.ID;
        this.saveChangeStatusService(notification_flag);
      }
    }else{
      this.saveChangeStatusService(true);
    }
  }
  changeAccountingAccount(templateRef:any,id:number){//status = CERRADO || RECHAZADO || LIBERADO
    this.changeAccountingAccountData.ID=id;
    this.modalRef=this.modalService.show(templateRef);
  }
  saveChangeAccountingAccount(){
    const elementsSelected= this.allSettings.filter(e => {
      if((e.ESTADO_INTEGRACION=='NO_PROCEDE_REGLA' || 
      e.ESTADO_INTEGRACION=='PROCEDE_MONITOR' || 
      e.ESTADO_INTEGRACION=='REPROCESO') && 
      e.checked){
        return e
      }
    })
    if(elementsSelected.length>0){
      for(let element of elementsSelected){
        const notification_flag= (elementsSelected.length==elementsSelected.indexOf(element)+1)?true:false;
        this.changeAccountingAccountData.ID=element.ID;
        this.saveChangeAccountingAccountService(notification_flag);
      }
    }else{
      this.saveChangeAccountingAccountService(true);
    }
  }
  saveChangeAccountingAccountService(notification_flag?:boolean){
    this.settingsService.changeAccountingAccount(this.changeAccountingAccountData)
      .subscribe(response => {
        if(response.data){
          this.spinner.hide();
          response.data.checked=false;
          this.allSettings=this.allSettings.map(e=>{return e.ID==response.data.ID? response.data : e}  )
          this.settings = this.allSettings.slice(0, 10);
          this.modalRef.hide();
          this.setDefaultValues();
          if(notification_flag)
            this.notificationService.showSuccess('Operación realiza exitosamente',response.message)
        }
      },(error)=>{
        console.log("error:",error)
      });
  }
  saveChangeStatusService(notification_flag?:boolean){
    this.spinner.show();
    this.settingsService.changeStatus(this.changeStatusData)
    .subscribe(response => {
      if(response.data){
        this.spinner.hide();
        response.data.checked=false;
        this.allSettings=this.allSettings.map(e=>{return e.ID==response.data.ID? response.data : e}  )
        this.settings = this.allSettings.slice(0, 10);
        this.modalRef.hide();
        this.setDefaultValues();
        if(notification_flag)
          this.notificationService.showSuccess('Operación realiza exitosamente',response.message)
      }
    },(error)=>{
      console.log("error:",error)
    });
  }
  setDefaultValues(){
    this.changeStatusData.ID=null;
    this.changeStatusData.OBS_ADMINISTRADOR=null;
    this.changeStatusData.STATUS=null;

    this.changeAccountingAccountData.ID=null;
    this.changeAccountingAccountData.CUENTA_CONTABLE=null;
  }
}
