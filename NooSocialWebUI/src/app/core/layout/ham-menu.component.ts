import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgForOf, NgClass } from "@angular/common";

import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { UserService } from "../../core/services/user.service";
import { LetDirective } from "@rx-angular/template/let";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";

import { TimelineListComponent } from "../../shared/timeline-helpers/tl-list.component";
import { TimelinesService } from "../../core/services/timelines.service";

import { UserAvatarComponent } from "../../shared/user-helpers/user-avatar.component";
import { GlobalsService } from "../../core/services/globals.service";
import { GlobalData } from "../../core/models/global-data.model";

import { ViewStateService } from "../../core/services/viewState.service";
import { ProfilesService } from "../../core/services/profiles.service";

import { ProfileListComponent } from "../../shared/profile-helpers/profile-list.component";

@Component({
  selector: "app-ham-menu",
  templateUrl: "./ham-menu.component.html",
  imports: [
    NgClass,
    UserAvatarComponent,
    AsyncPipe,
    LetDirective,
    NgForOf,
    ShowAuthedDirective,
  ],
  standalone: true,
})
export class HamMenuComponent {
  
  currentUser$ = inject(UserService).currentUser;

  constructor(
    private readonly userService: UserService,
    public readonly tlService: TimelinesService,
    public readonly globalService: GlobalsService,
    public readonly profilesService: ProfilesService,
    private readonly vs: ViewStateService
  ) {

  }

  toggleTlVisibility(idx: number) {

    this.vs.toggleState('hidden-tl-' + idx);
  }
}
