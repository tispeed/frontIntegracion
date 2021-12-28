import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

// modulos compartidos
import { SharedModule } from "src/app/modules/shared/shared.module";

import { UsersComponent } from "./users/users.component";
import { RolsComponent } from "./rols/rols.component";
//pipes

import { RouterModule } from "@angular/router";
import { SafetyRoutes } from "./safety.routing";

@NgModule({
  declarations: [
    UsersComponent,
    RolsComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    RouterModule.forChild(SafetyRoutes)
  ],
  exports: [
    UsersComponent, 
    RolsComponent,
  ],
  providers: [],
})
export class SafetyModule {}
