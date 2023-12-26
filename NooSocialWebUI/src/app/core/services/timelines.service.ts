import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Timeline } from "../models/timeline.model";

@Injectable({ providedIn: "root" })
export class TimelinesService {

  loaded: boolean = false;

  timelines: Timeline[] = [];

  constructor(private readonly http: HttpClient) {}

  query(): Observable<{ timelines: Timeline[]; timelinesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    let params = new HttpParams();

    /*
    Object.keys(config.filters).forEach((key) => {
      // @ts-ignore
      params = params.set(key, config.filters[key]);
    });
    */

    console.log('calling query()');
    
    return this.http.get<{ timelines: Timeline[]; timelinesCount: number }>(
      "/timelines",
      { params }
    );
  }

  get(slug: string): Observable<Timeline> {
    return this.http
      .get<{ timeline: Timeline }>(`/timelines/${slug}`)
      .pipe(map((data) => data.timeline));
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`/timelines/${slug}`);
  }

  create(timeline: Partial<Timeline>): Observable<Timeline> {
    return this.http
      .post<{ timeline: Timeline }>("/timelines/", { timeline: timeline })
      .pipe(map((data) => data.timeline));
  }

  update(timeline: Partial<Timeline>): Observable<Timeline> {
    return this.http
      .put<{ timeline: Timeline }>(`/timelines/${timeline.slug}`, {
        timeline: timeline,
      })
      .pipe(map((data) => data.timeline));
  }

  favorite(slug: string): Observable<Timeline> {
    return this.http
      .post<{ timeline: Timeline }>(`/timelines/${slug}/favorite`, {})
      .pipe(map((data) => data.timeline));
  }

  unfavorite(slug: string): Observable<void> {
    return this.http.delete<void>(`/timelines/${slug}/favorite`);
  }
}
