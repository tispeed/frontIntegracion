import { Routes } from "@angular/router";

import { TransfersComponent } from "./transfers/transfers.component";
import { SettingsComponent } from "./settings/settings.component";
// import { SeeReceptionComponent } from "./see-reception/see-reception.component";

export const MonitorsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "transfers",
        component: TransfersComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "settings",
        component: SettingsComponent
      }
    ]
  },
  // {
  //   path: "",
  //   children: [
  //     {
  //       path: "see-reception",
  //       component: SeeReceptionComponent
  //     }
  //   ]
  // },
  

];
