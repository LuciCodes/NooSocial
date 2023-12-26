import { Component, Input } from "@angular/core";

import { Timeline } from "../../core/models/timeline.model";

import { TlPostComponent } from "./tl-post.component";

import { RouterLink } from "@angular/router";
import { NgClass, NgForOf } from "@angular/common";

@Component({
  selector: "app-tl-item",
  templateUrl: "./tl-item.component.html",
  imports: [TlPostComponent, RouterLink, NgClass, NgForOf],
  standalone: true,
})
export class TlItemComponent {
  
  flagSettingsExpanded: boolean = false;

  @Input() timeline!: Timeline;

}
