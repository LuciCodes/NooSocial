import { Component, OnInit, inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf } from "@angular/common";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";
import { ViewStateService } from "../services/viewState.service";
import {
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from "@angular/forms";
import { Subject } from "rxjs";

interface loginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: "app-user-account",
  templateUrl: "./user-account.component.html",
  imports: [
    RouterLinkActive, 
    RouterLink, 
    AsyncPipe, 
    NgIf, 
    ShowAuthedDirective, 
    ReactiveFormsModule
  ],
  standalone: true,
})
export class UserAccountComponent implements OnInit {
  
  currentUser$ = inject(UserService).currentUser;

  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private vs: ViewStateService
  ) {

      
  }
  
  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectPage(pagename: string) {

    this.vs.removeStates('page-selected-');

    this.vs.setState('page-selected-user-account-' + pagename);
  }

  maybeLogout(){

    if (confirm('Are you sure?')) {

      this.vs.removeStates('page-visible-user-account');
      this.userService.logout();
    }
  }
}
