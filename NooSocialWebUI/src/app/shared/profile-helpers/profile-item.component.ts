import { Component, Input } from "@angular/core";

import { ProfileInfo } from "../../core/models/profile-info.model";

import { RouterLink } from "@angular/router";
import { NgClass, NgForOf } from "@angular/common";

@Component({
  selector: "app-profile-item",
  templateUrl: "./profile-item.component.html",
  imports: [RouterLink, NgClass, NgForOf],
  standalone: true,
})
export class ProfileItemComponent {
  
  flagSettingsExpanded: boolean = false;

  @Input() profile!: ProfileInfo;

}
