import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { TimelinesService } from "../../core/services/timelines.service";

import { Timeline } from "../../core/models/timeline.model";

import { TlItemComponent } from "./tl-item.component";

import { NgClass, NgForOf, NgIf } from "@angular/common";
import { LoadingState } from "../../core/models/loading-state.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ViewStateService } from "../../core/services/viewState.service";

@Component({
  selector: "app-timeline-list",
  styleUrls: ["tl-list.component.css"],
  templateUrl: "./tl-list.component.html",
  imports: [
    TlItemComponent,
    NgForOf, 
    NgClass, 
    NgIf
  ],
  standalone: true,
})
export class TimelineListComponent implements OnDestroy, OnInit {

  //query!: TimelineListConfig;
  timelines: Timeline[] = [];
  
  loading = LoadingState.NOT_LOADED;
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

  constructor(
    private timelinesService: TimelinesService,
    private vs: ViewStateService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.runQuery();
  }

  runQuery() {

    this.loading = LoadingState.LOADING;
    this.timelines = [];

    this.timelinesService
      .query()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {

        this.loading = LoadingState.LOADED;
        
        if (data.timelines && data.timelines.length > 0) {

          for (let t = 0; t < data.timelines.length; t++) {
            this.timelines.push(new Timeline(data.timelines[t]));
          }

          this.timelinesService.timelines = this.timelines;
          this.timelinesService.loaded = true;
        }

        this.vs.loadState();
      });
  }
}
