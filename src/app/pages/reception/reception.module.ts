import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// modulos compartidos
import { SharedModule } from "src/app/modules/shared/shared.module";

import { ReceptionIntegrationComponent } from "./reception-integration/reception-integration.component";
import { ReceptionManualReturnsComponent } from "./reception-manual-returns/reception-manual-returns.component";

import { SortPipe } from 'src/app/pipes/sort.pipe';

import { RouterModule } from "@angular/router";
import { ReceptionRoutes } from "./reception.routing";

@NgModule({
  declarations: [
    ReceptionIntegrationComponent,
    ReceptionManualReturnsComponent,
    SortPipe,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(ReceptionRoutes)
  ],
  exports: [
  ],
  providers: [SortPipe],
})
export class ReceptionModule {}
