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
  selector: "app-login-subscribe",
  templateUrl: "./login-subscribe.component.html",
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
export class LoginSubscribeComponent implements OnInit {
  
  authType = '';
  
  isSubmitting = false;
  loginForm: FormGroup<loginForm>;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly userService: UserService,
    private vs: ViewStateService
  ) {

      this.loginForm = new FormGroup<loginForm>({
        username: new FormControl("", {
          validators: [Validators.required],
          nonNullable: true,
        }),
        password: new FormControl("", {
          validators: [Validators.required],
          nonNullable: true,
        }),
      });
  }

  selectPage(pagename: string) {

    this.vs.removeStates('login-subscribe-page-selected');

    this.vs.setState('login-subscribe-selected-' + pagename);
  }
  
  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitLogin(): void {

    this.isSubmitting = true;

    this.userService.signInUser(

      this.loginForm.value.username || '', 
      this.loginForm.value.password || '').then((data) => {

      //console.log('LOGIN-SIGNIN', data);
    
      if(this.userService.isAuthenticated)
        this.vs.removeStates('page-visible-login-subscribe');

      this.isSubmitting = false;
    });
  }
}
