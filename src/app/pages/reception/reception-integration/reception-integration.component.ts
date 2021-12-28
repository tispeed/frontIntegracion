import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { SortPipe } from "src/app/pipes/sort.pipe";
import { ReceptionsService } from "src/app/core/services/receptions.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from "moment";

//xlsx
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import { GenericFilterPipe } from 'src/app/pipes/generic-filter.pipe';
import { FilterByColumnPipe } from 'src/app/pipes/filter-by-column.pipe';
@Component({
  selector: "app-reception-integration",
  templateUrl: "reception-integration.component.html",
  styleUrls:["./reception-integration.component.scss"],
})
export class ReceptionIntegrationComponent implements OnInit, OnDestroy {
  public dateRange: any[] = [];
  public searchTable: string = null;
  public headerElements: any[] = [
    { name: 'SELECCIÓN', key: 'SELECCIÓN', show_flag: false, scope: "*" },
    { name: 'TIPO_RECEPCION', key: 'TIPO_RECEPCION', show_flag: false, scope: "*" },
    { name: 'OC/FACT RESERVA', key: 'OC/FACT RESERVA', show_flag: false, scope: "*" },
    { name: 'NUMERO_GRP', key: 'NUMERO_GRP', show_flag: false, scope: "*" },
    { name: 'FECHA_RECEPCION', key: 'FECHA_RECEPCION', show_flag: false, scope: "*" },
    { name: 'DOCNUM', key: 'DOCNUM', show_flag: false, scope: "*" },
    { name: 'CONTRATO', key: 'CONTRATO', show_flag: false, scope: "2" },
    { name: 'CODIGO_SAP', key: 'CODIGO_SAP', show_flag: true, scope: "2" },
    { name: 'UNIDADES', key: 'UNIDADES', show_flag: true, scope: "2" },
  ];

  public firstElementFilter: any = {};
  public secondElementFilter: any = {};
  public allReceptions: any[] = [];
  public receptions: any[] = [];
  public totalItems: number = 0;
  public receptionsByReserva: any[] = [];
  public allReceptionsByReserva: any[] = [];
  //excel file
  public data: Array<any> = null;
  constructor(
    private receptionsService: ReceptionsService,
    private genericFilterPipe: GenericFilterPipe,
    private filterByColumnPipe: FilterByColumnPipe,
    private spinner: NgxSpinnerService,
    private sortPipe: SortPipe) { }
  ngOnInit() {     
    this.setDefaultDateRange()
  }
  ngOnDestroy() { }
  setDefaultDateRange() {
    this.dateRange = [moment().utc().subtract(1, 'days').format('MM/DD/yyyy'), moment().utc().format('MM/DD/yyyy')]
    if (this.dateRange[0] && this.dateRange[1]) {
      this.getByRangeDate(moment.utc(this.dateRange[0]).format("YYYY-MM-DD"), moment.utc(this.dateRange[1]).format("YYYY-MM-DD"))
    }
  }
  changeDateRange(event) {
    if (this.dateRange[0] && this.dateRange[1]) {
      this.getByRangeDate(moment.utc(this.dateRange[0]).format("YYYY-MM-DD"), moment.utc(this.dateRange[1]).format("YYYY-MM-DD"))
    }
  }
  getByRangeDate(from, to) {
    this.spinner.show();
    this.receptionsService.getDIRecepcionesGFAUTbyRangeDate({
      from: moment.utc(from).format("MM/DD/YYYY"),
      to: moment.utc(to).format("MM/DD/YYYY")
    })
      .subscribe(response => {
        if (response.data) {
          this.spinner.hide();
          //this.allReceptions = response.data;
          response.data=response.data.map(d=>{
            d.checked=false;
            return d;
          })
          this.allReceptions = Array.from(new Set(response.data.map(x => x['OC/FACT RESERVA']))).map(reserva => {
            return response.data.find(e => e['OC/FACT RESERVA'] == reserva)
          });
          this.totalItems = this.allReceptions.length;
          this.receptions = this.allReceptions.slice(0, 10);
        }
      }, (error) => {
        console.log("error:", error)
      });
  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.receptions = this.allReceptions.slice(startItem, endItem);
  }
  onSearchChange($event: any, field: string, tableId: string) {
    let object = {}
    const keys = !!Object.keys(this.firstElementFilter).length ? Object.keys(this.firstElementFilter) : null;
    switch (tableId) {
      case 'table1':
        if (keys) {
          for (let key of keys) {
            if (this.firstElementFilter[key] && this.firstElementFilter[key] != '') {
              const value = { [key]: this.firstElementFilter[key] };
              object = Object.assign(this.firstElementFilter, value);
            }
          }
        }
        if (field) {
          const value = { [field]: $event.target.value };
          object = Object.assign(this.firstElementFilter, value);

          this.firstElementFilter = Object.assign({}, object)
        }

        this.receptions = (
          (this.searchTable &&
            this.searchTable != '') || (
            Object.keys(this.firstElementFilter).length > 0 &&
            Object.values(this.firstElementFilter).length > 0 &&
            Object.values(this.firstElementFilter).find(e => e != "") != undefined)) ?
          this.allReceptions :
          this.allReceptions.slice(0, 10);
        break;
      case 'table2':
        if (keys) {
          for (let key of keys) {
            if (this.secondElementFilter[key] && this.secondElementFilter[key] != '') {
              const value = { [key]: this.secondElementFilter[key] };
              object = Object.assign(this.secondElementFilter, value);
            }
          }
        }
        if (field) {
          const value = { [field]: $event.target.value };
          object = Object.assign(this.secondElementFilter, value);

          this.secondElementFilter = Object.assign({}, object)
        }

        this.receptionsByReserva = (
          (this.searchTable &&
            this.searchTable != '') || (
            Object.keys(this.secondElementFilter).length > 0 &&
            Object.values(this.secondElementFilter).length > 0 &&
            Object.values(this.secondElementFilter).find(e => e != "") != undefined)) ?
          this.allReceptionsByReserva :
          this.allReceptionsByReserva.slice(0, 10);
        break;
      default:
        break;
    }
  }
  /*generacion de reporte en excel*/
  generateReport(elements: string) {
    let filteredArray = []
    let genericFilterPipeTransform = []
    let filterByColumnPipeTransform = []
    switch (elements) {
      case 'all':
        genericFilterPipeTransform = this.searchTable ? this.genericFilterPipe.transform(this.receptions, this.searchTable) : this.allReceptions;
        filterByColumnPipeTransform = this.filterByColumnPipe.transform(genericFilterPipeTransform, this.firstElementFilter);

        filteredArray = genericFilterPipeTransform.length >= filterByColumnPipeTransform.length ? genericFilterPipeTransform.filter(value => filterByColumnPipeTransform.includes(value)) : filterByColumnPipeTransform.filter(value => genericFilterPipeTransform.includes(value));
        break;
        case 'by_reserva':
          genericFilterPipeTransform = this.allReceptionsByReserva;
          filterByColumnPipeTransform = this.filterByColumnPipe.transform(genericFilterPipeTransform, this.secondElementFilter);
  
          filteredArray = genericFilterPipeTransform.length >= filterByColumnPipeTransform.length ? genericFilterPipeTransform.filter(value => filterByColumnPipeTransform.includes(value)) : filterByColumnPipeTransform.filter(value => genericFilterPipeTransform.includes(value));
          break;
      default:
        break;
    }
    this.data = new Array();
    for (let reception of filteredArray) {
      this.data.push({
         TIPO_RECEPCION: reception.TIPO_RECEPCION,
         "OC/FACT RESERVA": reception["OC/FACT RESERVA"],
         NUMERO_GRP: reception.NUMERO_GRP,
         FECHA_RECEPCION: reception.FECHA_RECEPCION,
         DOCNUM: reception.DOCNUM,
         CONTRATO: reception.CONTRATO,
         CODIGO_SAP:reception.CODIGO_SAP,
         UNIDADES: reception.UNIDADES,
      });
    }
    let fileName = null;
    switch (elements) {
      case 'all':
        fileName = 'listado-recepciones-por-integracion'
        break;
      case 'by_reserva':
        fileName = 'listado-recepciones-devoluciones-manuales-por-reserva'
        break;
      default:
        break;
    }
    if (fileName)
      this.exportAsExcelFile(this.data, fileName);
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
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + new Date() + EXCEL_EXTENSION);
  }
  checkboxChanged(event: any, element_selected: any) {
    if (element_selected) {
      switch (element_selected) {
        case "all":
          this.allReceptions = event.target && event.target.checked ? this.allReceptions.map(e => {
            e.checked = true;
            return e;
          }) : this.allReceptions.map(e => {
            e.checked = false;
            return e;
          })
          break;
        default:
          this.allReceptions = this.allReceptions.map(e => {
            if (e.ID == element_selected.ID) e.checked = event.target.checked
            return e;
          })
          break;
      }
      this.allReceptionsByReserva = [];
      for (let reception of this.allReceptions) {
      if (reception['OC/FACT RESERVA'] && reception.checked && this.dateRange[0] && this.dateRange[1]) {
          this.receptionsService.getDIRecepcionesGFAUTbyRangeDateAndReserva(reception['OC/FACT RESERVA'], {
            from: moment.utc(this.dateRange[0]).format("MM/DD/YYYY"),
            to: moment.utc(this.dateRange[1]).format("MM/DD/YYYY")
          })
            .subscribe(response => {
              if (response.data) {
                for(let element of response.data){
                  this.allReceptionsByReserva.push(element);
                }
              }
            }, (error) => {
              console.log("error:", error)
            });
        }
      }
      if(!event.target.checked){
        const element_selected = this.allReceptions.find(e => e.checked)
        if(element_selected){
          this.selectRow(element_selected)
        }else{
          this.receptionsByReserva = []
        }
      }else{
        this.selectRow(element_selected)
      }
    }
  }
  selectRow(reception: any) {
    if (this.dateRange[0] && this.dateRange[1]) {
      this.getByRangeDateAndFolio(reception['OC/FACT RESERVA'], moment.utc(this.dateRange[0]).format("YYYY-MM-DD"), moment.utc(this.dateRange[1]).format("YYYY-MM-DD"))
    }
  }
  getByRangeDateAndFolio(reserva, from, to) {
    this.spinner.show();
    this.receptionsService.getDIRecepcionesGFAUTbyRangeDateAndReserva(reserva, {
      from: moment.utc(from).format("MM/DD/YYYY"),
      to: moment.utc(to).format("MM/DD/YYYY")
    })
      .subscribe(response => {
        if (response.data) {
          this.spinner.hide();
          this.receptionsByReserva = response.data;
        }
      }, (error) => {
        console.log("error:", error)
      });
  }
}
