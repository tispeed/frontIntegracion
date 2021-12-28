import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full"
  },
  {
    path: "admin",
    component: AdminLayoutComponent,
    children: [
      {
        path: "monitors",
        loadChildren: "./pages/monitors/monitors.module#MonitorsModule"
      },
      {
        path: "branch-offices",
        loadChildren: "./pages/branch-offices/branch-offices.module#BranchOfficesModule"
      },
      {
        path: "safety",
        loadChildren: "./pages/safety/safety.module#SafetyModule"
      },
      {
        path: "reception",
        loadChildren: "./pages/reception/reception.module#ReceptionModule"
      },
    ]
  },
  {
    path: "test",
    component: AdminLayoutComponent,
    children: [
      {
        path: "test",
        loadChildren: "./pages/test/test.module#TestModule"
      },    
    ]
  },
  {
    path: "auth",
    component: AuthLayoutComponent,
    children: [
      {
        path: "login",
        loadChildren: "./pages/login/login.module#LoginModule"
      },
    ]
  },
  {
    path: "**",
    redirectTo: "dashboard"
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
