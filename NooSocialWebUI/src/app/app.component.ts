import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ViewStateService } from "./core/services/viewState.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  
  router:any = null;
  routerUrl: string;
  
  constructor(private _router: Router, private vs: ViewStateService){

    this.router = _router; 
    this.routerUrl = _router.url; 
  }
  ngOnInit(): void {

    this.routerUrl = this.router.url; 

    //this.vs.loadState();
  }
}
