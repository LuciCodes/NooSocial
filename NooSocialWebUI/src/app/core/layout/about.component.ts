import { Component, OnInit, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { ViewStateService } from "../services/viewState.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  imports: [RouterLinkActive, RouterLink, AsyncPipe, NgIf, ShowAuthedDirective],
  standalone: true,
})
export class AboutComponent implements OnInit {
  
  constructor(private vs: ViewStateService) {

  }

  ngOnInit(): void {

    if (this.vs.hasStateStartingWith('page-visible-about') && !this.vs.hasStateStartingWith('page-selected-about'))
      this.vs.setState('page-selected-about-the-idea');
  }

  selectPage(pagename: string) {

    this.vs.removeStates('page-selected-');

    this.vs.setState('page-selected-about-' + pagename);
  }
}
