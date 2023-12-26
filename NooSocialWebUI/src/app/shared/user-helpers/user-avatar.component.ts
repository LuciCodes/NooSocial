import { Component, Input } from '@angular/core';

import { RouterLink } from "@angular/router";
import { NgClass, NgForOf } from "@angular/common";

import { ProfileInfo } from '../../core/models/profile-info.model';
import { ViewStateService } from '../../core/services/viewState.service';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [RouterLink, NgClass, NgForOf],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css'
})
export class UserAvatarComponent {

  @Input() user!: ProfileInfo;

  constructor(private vs: ViewStateService) {

  }

  toggleAvatarSelected(id: string) {

    this.vs.toggleFeedProfile(id);
  }
}