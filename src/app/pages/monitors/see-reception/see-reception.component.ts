import { Component, OnInit } from "@angular/core";
import { SortPipe } from "src/app/pipes/sort.pipe";

@Component({
  selector: "app-see-reception",
  templateUrl: "see-reception.component.html"
})
export class SeeReceptionComponent implements OnInit {
  public receptions:any[]=[];
  public totalItems:number=0;
  
  public elementsSelected:any[]=[];

  public searchTable:string=null;
  public highestToLowest:any={
    id:false,
    type:false,
  }
  constructor(
    private sortPipe: SortPipe) {}

  ngOnInit() {}

  search(){
    this.elementsSelected=[];
    const receptions=[{
      _id:"1",
      selected:false,
      id:"id1",
      type:"type1",
    },{
      _id:"2",
      selected:false,
      id:"id2",
      type:"type2",
    },{
      _id:"3",
      selected:false,
      id:"id3",
      type:"type3",
    }]
    this.totalItems= receptions.length;
    this.receptions = receptions.slice(0, 10);
  }
  /*ordenado de listado por orden alfabetico*/ 
  sortTableBy(element:string){
    const order=this.highestToLowest[element]?"asc":"desc";
    this.receptions=this.sortPipe.transform(this.receptions, order, element);
    this.highestToLowest[element]=!this.highestToLowest[element];
  }
}
