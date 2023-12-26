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
  
  authType = "";
  
  isSubmitting = false;
  loginForm: FormGroup<loginForm>;
  destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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

    this.authType = this.route.snapshot.url.at(-1)!.path;

    //  this.title = this.authType === "login" ? "Sign in" : "Sign up";

    if (this.authType === "register" && this.loginForm != null) {
      this.loginForm.addControl(
        "username",
        new FormControl("", {
          validators: [Validators.required],
          nonNullable: true,
        })
      );
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitLogin(): void {

    this.isSubmitting = true;

    /*
    let observable =
      this.authType === "login"
        ? this.userService.login(
            this.loginForm.value as { email: string; password: string }
          )
        : this.userService.register(
            this.loginForm.value as {
              email: string;
              password: string;
              username: string;
            }
          );

    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => void this.router.navigate(["/"]),
      error: (err) => {
        this.errors = err;
        this.isSubmitting = false;
      },
    });
    */
  }
}
