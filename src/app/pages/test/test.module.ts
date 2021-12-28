import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

// modulos compartidos
import { SharedModule } from "src/app/modules/shared/shared.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { TestComponent } from "./test/test.component";


import { RouterModule } from "@angular/router";
import { TestRoutes } from "./test.routing";

import { DataTablesModule } from 'angular-datatables';
@NgModule({
  declarations: [
    TestComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DataTablesModule,
    RouterModule.forChild(TestRoutes)
  ],
  exports: [
    TestComponent, 
  ],
  providers: [],
})
export class TestModule {}
