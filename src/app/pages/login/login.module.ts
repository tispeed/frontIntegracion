import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

// modulos compartidos
import { SharedModule } from "src/app/modules/shared/shared.module";

import { LoginComponent } from "./login/login.component";

import { RouterModule } from "@angular/router";
import { LoginRoutes } from "./login.routing";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    RouterModule.forChild(LoginRoutes)
  ],
  exports: [
    LoginComponent
  ],
  providers: [],
})
export class LoginModule {}
