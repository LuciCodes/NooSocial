
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { LoadingState } from "../../core/models/loading-state.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ProfilesService } from "../../core/services/profiles.service";

import { ProfileItemComponent } from "./profile-item.component";

import { NgClass, NgForOf, NgIf } from "@angular/common";

import { ProfileInfo } from "../../core/models/profile-info.model";

@Component({
  selector: "app-profile-list",
  styleUrls: ["profile-list.component.css"],
  templateUrl: "./profile-list.component.html",
  imports: [
    ProfileItemComponent,
    NgForOf, 
    NgClass, 
    NgIf
  ],
  standalone: true,
})
export class ProfileListComponent implements OnDestroy, OnInit {

  @Input() 
  profiles: ProfileInfo[] = [];

  loading = LoadingState.LOADED;
  LoadingState = LoadingState;
  
  destroy$ = new Subject<void>();

  @Input() limit!: number;

  /*
  @Input()
  set config(config: TimelineListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }
  */

  constructor(private profilesService: ProfilesService) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    //this.runQuery();
  }

  /*
  runQuery() {

    this.loading = LoadingState.LOADING;
    this.profiles = [];

    this.profilesService
      .get('')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {

        this.loading = LoadingState.LOADED;
        
        this.profiles.push(new ProfileInfo(data));

      });
  }
  */
}
