import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";
// modulos compartidos
import { SharedModule } from "src/app/modules/shared/shared.module";

import { InventoryComponent } from "./inventory/inventory.component";
import { EventsComponent } from "./events/events.component";

import { RouterModule } from "@angular/router";
import { BranchOfficesRoutes } from "./branch-offices.routing";

@NgModule({
  declarations: [
    InventoryComponent,
    EventsComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    RouterModule.forChild(BranchOfficesRoutes)
  ],
  exports: [
    InventoryComponent, 
    EventsComponent,
  ]
})
export class BranchOfficesModule {}
