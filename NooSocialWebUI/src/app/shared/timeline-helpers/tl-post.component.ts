import { Component, Input } from "@angular/core";
import { Post } from "../../core/models/post.model";

import { TlLikeButtonComponent } from "../buttons/tl-like-button.component";
import { TlDislikeButtonComponent } from "../buttons/tl-dislike-button.component";
import { TlReportButtonComponent } from "../buttons/tl-report-button.component";
import { TlRepostButtonComponent } from "../buttons/tl-repost-button.component";

import { RouterLink } from "@angular/router";
import { NgClass, NgForOf } from "@angular/common";

@Component({
  selector: "app-tl-post",
  templateUrl: "./tl-post.component.html",
  imports: [
    TlLikeButtonComponent, 
    TlDislikeButtonComponent,
    TlReportButtonComponent,
    TlRepostButtonComponent,
    RouterLink,
    NgClass,
    NgForOf
  ],
  standalone: true,
})
export class TlPostComponent {

  flagFooterExpanded: boolean = false;

  flagReplyExpanded: boolean = false;

  @Input() post!: Post;

}
