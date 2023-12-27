import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";

import { takeUntil, tap } from "rxjs/operators";
import { Subject } from "rxjs";
import { UserService } from "../../core/services/user.service";
import { ShowAuthedDirective } from "../../shared/show-authed.directive";

import { TimelineListComponent } from "../../shared/timeline-helpers/tl-list.component";
import { TimelinesService } from "../../core/services/timelines.service";

import { UserAvatarComponent } from "../../shared/user-helpers/user-avatar.component";
import { GlobalsService } from "../../core/services/globals.service";
import { GlobalData } from "../../core/models/global-data.model";

import { ViewStateService } from "../../core/services/viewState.service";
import { ProfilesService } from "../../core/services/profiles.service";

import { ProfileListComponent } from "../../shared/profile-helpers/profile-list.component";
import { HamMenuComponent } from "../../core/layout/ham-menu.component";
import { ProfileInfo } from "../../core/models/profile-info.model";

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [
    NgClass,
    HamMenuComponent,
    TimelineListComponent,
    ProfileListComponent,
    UserAvatarComponent,
    AsyncPipe,
    NgForOf,
    ShowAuthedDirective,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit, OnDestroy {

  isAuthenticated = false;

  destroy$ = new Subject<void>();

  get profiles(): ProfileInfo[] {

    // for only one profile at time:
    let result = [];

    if (this.vs.selectedProfile != null)
      result.push(this.vs.selectedProfile);

    return result;

    /*
    // for multiple profiles:
    return this.profilesService.profiles
    */
  }

  constructor(
    private readonly userService: UserService,
    public readonly tlService: TimelinesService,
    public readonly globalService: GlobalsService,
    public readonly profilesService: ProfilesService,
    private readonly vs: ViewStateService
  ) {}

  ngOnInit(): void {

    console.log('FeedComponent.ngOnInit()');

    this.userService.isAuthenticated
      .pipe(
        tap((isAuthenticated) => {

          console.log('FeedComponent.isAuthenticated? ' + isAuthenticated);
          
          this.vs.flagHasUser = isAuthenticated;
          
          if (isAuthenticated) {
            

          } else {
            //this.setListTo("all");
          }
          
          this.globalService.query().subscribe((gd) => {

            this.globalService.loaded = true;
            this.globalService.globalData = new GlobalData(gd);

            console.log('GDATA:', this.globalService.globalData);
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isAuthenticated: boolean) => {
          
          console.log('FeedComponent.subscribe ' + isAuthenticated);

          this.isAuthenticated = isAuthenticated;
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
