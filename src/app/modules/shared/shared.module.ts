import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BsDropdownModule } from "ngx-bootstrap";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ModalModule } from "ngx-bootstrap/modal";
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { FormsModule } from "@angular/forms";
//pipes
import { GenericFilterPipe } from 'src/app/pipes/generic-filter.pipe';
import { FilterByColumnPipe } from 'src/app/pipes/filter-by-column.pipe';

@NgModule({
  declarations: [ 
    GenericFilterPipe,
    FilterByColumnPipe
  ],
  imports: [
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    SelectDropDownModule,
    FormsModule,
  ],
  exports: [
    GenericFilterPipe,
    FilterByColumnPipe,
    BsDropdownModule,
    ProgressbarModule,
    PaginationModule,
    TooltipModule,
    ModalModule,
    SelectDropDownModule,
    FormsModule,
  ],
  providers: [
    GenericFilterPipe,
    FilterByColumnPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
