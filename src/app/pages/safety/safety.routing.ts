import { Routes } from "@angular/router";

import { UsersComponent } from "./users/users.component";
import { RolsComponent } from "./rols/rols.component";

export const SafetyRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "users",
        component: UsersComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "rols",
        component: RolsComponent
      }
    ]
  }
];
