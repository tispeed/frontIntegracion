import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from './services/users.service';
import { RolsService } from './services/rols.service';
import { ApplicationModulesService } from './services/application-modules.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    UsersService,
    RolsService,
    ApplicationModulesService
  ]
})
export class CoreModule { }
