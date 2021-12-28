import { Routes } from "@angular/router";

import { ReceptionIntegrationComponent } from "./reception-integration/reception-integration.component";
import { ReceptionManualReturnsComponent } from "./reception-manual-returns/reception-manual-returns.component";

export const ReceptionRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "reception-integration",
        component: ReceptionIntegrationComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "reception-manual-returns",
        component: ReceptionManualReturnsComponent
      }
    ]
  },
  

];
