import { Component, OnInit, OnDestroy, ViewChildren} from "@angular/core";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { SortPipe } from "src/app/pipes/sort.pipe";
import { TransfersService } from "src/app/core/services/transfers.service";
import { NotificationService } from "src/app/core/services/notification.service";
import { actionConfigObj, } from "src/app/configs/selects";

//xlsx
import * as XLSX from "xlsx"; 
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import * as moment from "moment";

import { GenericFilterPipe } from 'src/app/pipes/generic-filter.pipe';
import { FilterByColumnPipe } from 'src/app/pipes/filter-by-column.pipe';

@Component({
  selector: "app-transfers",
  templateUrl: "transfers.component.html",
  styleUrls:["./transfers.component.scss"],
  providers: [ FilterByColumnPipe ]
})
export class TransfersComponent implements OnInit, OnDestroy {
  public dateRange:any[]=[];

  public transfers:any[]=[];
  public allTransfers:any[]=[];
  @ViewChildren('filteredItems') filteredItems;
  public headerElements:any[]=[
    {name:'SELECCIÓN',show_flag:false},
    {name:'ID',show_flag:false},
    {name:'ESTADO_INTEGRACION',show_flag:false},
    {name:'FECHA_TRANSACCION',show_flag:false},
    {name:'SKU',show_flag:false},
    {name:'SKU_NUEVO',show_flag:false},
        {name:'CANTIDAD',show_flag:false},
        {name:'CONTRATO_ACTUAL',show_flag:false},
        {name:'ESTADO',show_flag:false},
        {name:'CONTRATO_NUEVO', show_flag:false},
        {name:'ESTADO_NUEVO',show_flag:false},
        {name:'LOTE',show_flag:false},
        {name:'LOTE_NUEVO',show_flag:false},
        {name:'ALMACEN_ACTUAL',show_flag:false},
        {name:'ALMACEN_NUEVO',show_flag:false},
        {name:'PALLET',show_flag:false},
        {name:'FOLIO_GOLDEN_FROST',show_flag:true},
        {name:'DOCNUM',show_flag:true},
        {name:'UxC',show_flag:true},
        {name:'UxC_nuevo',show_flag:true},
        {name:'OBS_REGLA',show_flag:true},
        {name:'OBS_ADMINISTRADOR',show_flag:true},
        {name:'ACCIONES',show_flag:false},
  ];
  
  public totalItems:number=0;
  public searchTable:string=null;
  public highestToLowest:any={
    project:false,
    budget:false,
    status:false
  }
  public elementFilter: any ={}; 
  public searchFilter:any={
    ESTADO_INTEGRACION:'',
    FECHA_TRANSACCION:'',
    SKU:'',
    SKU_NUEVO:'',
    CANTIDAD:'',
    CONTRATO_ACTUAL:'',
    ESTADO:'',
    CONTRATO_NUEVO:'',
    ESTADO_NUEVO:'',
    LOTE:'',
    LOTE_NUEVO:'',
    ALMACEN_ACTUAL:'',
    ALMACEN_NUEVO:'',
    PALLET:'',
    FOLIO_GOLDEN_FROST:'',
    DOCNUM:'',
    UxC:'',
    UxC_nuevo:'',
    OBS_REGLA:'',
    OBS_ADMINISTRADOR:''
  }
  public selected:string=null;

  public modalRef:any=null;
  
  public showMultiActionsFlag:boolean=false;
  public multiActionsFlag:any=null;

  public actionConfig:any=actionConfigObj;
  public actions:any[]=[
    {name:"Liberar",key:"PROCEDE_USU"},
    {name:"Rechazar",key:"RECHAZADO"},
    {name:"Cerrar",key:"CERRADO"},
  ];
  public showMoreColumnsFlag:boolean=false;
  //excel file
  public data: Array<any>=null;

  public changeStatusData:any={
    ID:null,
    OBS_ADMINISTRADOR:null,
    STATUS:null
  }
  constructor(
    private modalService: BsModalService,
    private genericFilterPipe:GenericFilterPipe,
    private filterByColumnPipe: FilterByColumnPipe,
    private transfersService:TransfersService,
		private spinner: NgxSpinnerService,
    private notificationService:NotificationService,
    private sortPipe: SortPipe) {
  }
  ngOnInit() { 
    this.setDefaultDateRange()
  }
  ngOnDestroy() { }
  setDefaultDateRange(){
    this.dateRange=[moment().utc().subtract(1, 'days').format('MM/DD/yyyy'),moment().utc().format('MM/DD/yyyy')]
    if(this.dateRange[0] && this.dateRange[1]){
      this.getByRangeDate(moment.utc(this.dateRange[0]).format("YYYY-MM-DD"),moment.utc(this.dateRange[1]).format("YYYY-MM-DD"))      
    }
  }
  getByRangeDate(from,to){
    this.spinner.show();
      this.transfersService.getByRangeDate({
        from:from,
        to:to
      })
      .subscribe(response => {
        if(response.data){
          this.spinner.hide();
          this.allTransfers=response.data.map(e=> {
            // let index=response.data.indexOf(e)
            // e.ESTADO_INTEGRACION= index==0 || index==3 ?"NO_PROCEDE_REGLA":"PROCESADO"
            e.checked=false
            return e;
          })
          this.totalItems= this.allTransfers.length;
          this.transfers = this.allTransfers.slice(0, 10);
        }
      },(error)=>{
        console.log("error:",error)
      });
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.transfers = this.allTransfers.slice(startItem, endItem);
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
    this.transfers=(
      (this.searchTable && 
      this.searchTable!='') || ( 
      Object.keys(this.elementFilter).length>0 && 
      Object.values(this.elementFilter).length>0 && 
      Object.values(this.elementFilter).find(e=> e!="")!=undefined))?
      this.allTransfers:
      this.allTransfers.slice(0, 10);
  }
  closeModal(){
    this.modalRef.hide();
  }
  /*ordenado de listado por orden alfabetico*/ 
  sortTableBy(element:string){
    const order=this.highestToLowest[element]?"asc":"desc";
    this.transfers=this.sortPipe.transform(this.transfers, order, element);
    this.highestToLowest[element]=!this.highestToLowest[element];
  }
  changeDateRange(event){
    if(this.dateRange[0] && this.dateRange[1]){
      this.getByRangeDate(moment.utc(this.dateRange[0]).format("YYYY-MM-DD"),moment.utc(this.dateRange[1]).format("YYYY-MM-DD"))
    }
  }
  checkboxChanged(event:any, element_selected:any){
    switch (element_selected) {
      case "all":
        this.allTransfers=event.target && event.target.checked?this.allTransfers.map(e=>{
          e.checked=true;
          return e;
        }):this.allTransfers.map(e=>{
          e.checked=false;
          return e;
        })
        break;  
      default:
        this.allTransfers=this.allTransfers.map(e =>{
          if(e.ID==element_selected.ID) e.checked = event.target.checked
          return e;
        })
        break;
    }
    this.showMultiActionsFlag=element_selected=="all" &&  !event.target.checked?false:this.multiActionsFlagVerify()
  }
  multiActionsFlagVerify(){
    return this.allTransfers.find(e => {
      if(e.ESTADO_INTEGRACION!='NO_PROCEDE_REGLA' && 
      e.ESTADO_INTEGRACION!='PROCEDE_MONITOR' && 
      e.ESTADO_INTEGRACION!='REPROCESO' &&
      e.checked){
        return e
      }
    }) || this.allTransfers.filter(e => {
      if(
      e.checked){
        return e
      }
    }).length == 0  ? false : true ;
  }
  selectionChanged(event:any,element:string,templateRef:any){
    switch (element) {
      case 'action':
        this.changeStatusData.STATUS=event && event.value && event.value.key?event.value.key:null;
        this.modalRef=this.modalService.show(templateRef);
        break;
    
      default:
        break;
    }
  }
  /*generacion de reporte en excel*/
  generateReport(){
    const genericFilterPipeTransform = this.searchTable?this.genericFilterPipe.transform(this.transfers,this.searchTable):this.allTransfers;
    const filterByColumnPipeTransform = this.filterByColumnPipe.transform(genericFilterPipeTransform,this.elementFilter);
    
    const filteredArray = genericFilterPipeTransform.length>=filterByColumnPipeTransform.length?genericFilterPipeTransform.filter(value => filterByColumnPipeTransform.includes(value)):filterByColumnPipeTransform.filter(value => genericFilterPipeTransform.includes(value));
    
    this.data=new Array();
    for(let transfer of filteredArray){
       this.data.push({
        ESTADO_INTEGRACION:transfer.ESTADO_INTEGRACION,
        FECHA_TRANSACCION:transfer.FECHA_TRANSACCION,
        SKU:transfer.SKU,
        SKU_NUEVO:transfer.SKU_NUEVO,
        CANTIDAD:transfer.CANTIDAD,
        CONTRATO_ACTUAL:transfer.CONTRATO_ACTUAL,
        ESTADO:transfer.ESTADO,
        CONTRATO_NUEVO:transfer.CONTRATO_NUEVO,
        ESTADO_NUEVO:transfer.ESTADO_NUEVO,
        LOTE:transfer.LOTE,
        LOTE_NUEVO:transfer.LOTE_NUEVO,
        ALMACEN_ACTUAL:transfer.ALMACEN_ACTUAL,
        ALMACEN_NUEVO:transfer.ALMACEN_NUEVO,
        PALLET:transfer.PALLET,
        FOLIO_GOLDEN_FROST:transfer.FOLIO_GOLDEN_FROST,
        DOCNUM:transfer.DOCNUM,
        UxC:transfer.UxC,
        UxC_nuevo:transfer.UxC_nuevo,
        OBS_REGLA:transfer.OBS_REGLA,
        OBS_ADMINISTRADOR:transfer.OBS_ADMINISTRADOR,
       });
    }
    this.exportAsExcelFile(this.data, 'listado-traspasos');
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
    const elementsSelected= this.allTransfers.filter(e => {
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
  saveChangeStatusService(notification_flag?:boolean){
    this.spinner.show();
    this.transfersService.changeStatus(this.changeStatusData)
      .subscribe(response => {
        if(response.data){
          this.spinner.hide();
          response.data.checked=false;
          this.allTransfers=this.allTransfers.map(e=>{return e.ID==response.data.ID? response.data : e}  )
          this.transfers = this.allTransfers.slice(0, 10);
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
  }
}
