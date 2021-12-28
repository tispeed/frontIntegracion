import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/core/models/user.model";

var misc: any = {
  sidebar_mini_active: true
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}

//Menu Items
export let ROUTES: RouteInfo[] = [];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  
  public user:User=null;
  constructor(private router: Router) {}

  ngOnInit() {
    ROUTES=[
      {
        path: "monitors",
        title: "Monitores",
        type: "sub",
        icontype: "ni-shop text-primary",
        isCollapsed: true,
        children: [
          { path: "transfers", title: "Traspasos", type: "link" },
          { path: "settings", title: "Ajustes", type: "link" },
        ]
      },{
        path: "reception",
        title: "Recepción",
        type: "sub",
        icontype: "ni-tv-2 text-primary",
        isCollapsed: true,
        children: [
          { path: "reception-integration", title: "Recepción por Integración", type: "link" },
          { path: "reception-manual-returns", title: "Recepción y devoluciones Manuales", type: "link" },
        ]
      },{
        path: "safety",
        title: "Seguridad",
        type: "sub",
        icontype: "ni-lock-circle-open text-primary",
        isCollapsed: true,
        children: [
          { path: "users", title: "Administración Usuarios", type: "link" },
          { path: "rols", title: "Administración Roles", type: "link" },
        ]
      }
    ];
    this.getUser()
  }
  /*obtiene usuario en sesión desde localStorage*/
  getUser(){
    this.user=JSON.parse(localStorage.getItem("user"));
    this.buildSidebarOptions();
  }
  buildSidebarOptions(){
    if(this.user && this.user.rol && this.user.rol.modules){
      
      this.menuItems = ROUTES.filter(menuItem => {
        menuItem.children=menuItem.children.filter(c=>{
          if(this.user.rol.modules.find(e => e.module.key == c.path)) return c
          
        })
        return menuItem
      });
      this.router.events.subscribe(event => {
        this.isCollapsed = true;
      });
    }
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}
