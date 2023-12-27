import { Component, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { ViewStateService } from "../services/viewState.service";
import { AboutComponent } from "./about.component";
import { LoginSubscribeComponent } from "./login-subscribe.component";
import { UserAccountComponent } from "./user-account.component";

@Component({
  selector: "app-layout-header",
  templateUrl: "./header.component.html",
  imports: [
    AboutComponent,
    UserAccountComponent,
    JsonPipe, 
    LoginSubscribeComponent, 
    RouterLinkActive, 
    RouterLink, 
    AsyncPipe, 
    NgIf, 
    ShowAuthedDirective
  ],
  standalone: true,
})
export class HeaderComponent {
  
  currentUser$ = inject(UserService).currentUser;

  constructor(
    public vs: ViewStateService,
    public userService: UserService
  ) {

  }

  toggleAbout() {

    this.vs.toggleState('page-visible-about');
  }

  toggleLogin() {
    
    this.vs.toggleState('page-visible-login-subscribe');
  }

  toggleUserAccount() {
    
    this.vs.toggleState('page-visible-user-account');
  }
}
