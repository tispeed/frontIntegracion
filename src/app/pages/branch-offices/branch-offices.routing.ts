import { Routes } from "@angular/router";

import { InventoryComponent } from "./inventory/inventory.component";
import { EventsComponent } from "./events/events.component";

export const BranchOfficesRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "inventory",
        component: InventoryComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "events",
        component: EventsComponent
      }
    ]
  }
];
