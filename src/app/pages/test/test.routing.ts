import { Routes } from "@angular/router";

import { TestComponent } from "./test/test.component";

export const TestRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "test",
        component: TestComponent
      }
    ]
  }
];
