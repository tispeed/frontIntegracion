import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

// modulos compartidos
import { SharedModule } from "src/app/modules/shared/shared.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SettingsComponent } from "./settings/settings.component";
import { TransfersComponent } from "./transfers/transfers.component";
// import { SeeReceptionComponent } from "./see-reception/see-reception.component";
//pipes
/*import { GenericFilterPipe } from 'src/app/pipes/generic-filter.pipe';
import { FilterByColumnPipe } from 'src/app/pipes/filter-by-column.pipe';*/
import { SortPipe } from 'src/app/pipes/sort.pipe';


import { RouterModule } from "@angular/router";
import { MonitorsRoutes } from "./monitors.routing";

@NgModule({
  declarations: [
    SettingsComponent,
    TransfersComponent,
    // SeeReceptionComponent,
    SortPipe,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forChild(MonitorsRoutes)
  ],
  exports: [
    SettingsComponent, 
    TransfersComponent,
    // SeeReceptionComponent
  ],
  providers: [SortPipe],
})
export class MonitorsModule {}
