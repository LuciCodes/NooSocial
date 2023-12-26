import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Profile } from "../models/profile.model";
import { HttpClient } from "@angular/common/http";
import { ProfileInfo } from "../models/profile-info.model";

/*

Must delete profile.service when done, this is the correct one

*/
@Injectable({ providedIn: "root" })
export class ProfilesService {

  public profiles: ProfileInfo[] = [];

  constructor(private readonly http: HttpClient) {}

  get(username: string): Observable<Profile> {
    return this.http.get<{ profile: Profile }>("/profiles/" + username).pipe(
      map((data: { profile: Profile }) => data.profile),
      shareReplay(1)
    );
  }

  follow(username: string): Observable<Profile> {
    return this.http
      .post<{ profile: Profile }>("/profiles/" + username + "/follow", {})
      .pipe(map((data: { profile: Profile }) => data.profile));
  }

  unfollow(username: string): Observable<Profile> {
    return this.http
      .delete<{ profile: Profile }>("/profiles/" + username + "/follow")
      .pipe(map((data: { profile: Profile }) => data.profile));
  }
}
