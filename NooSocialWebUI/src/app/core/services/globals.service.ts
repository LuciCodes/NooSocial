import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { GlobalData } from "../models/global-data.model";

@Injectable({ providedIn: "root" })
export class GlobalsService {

  loaded: boolean = false;

  globalData: GlobalData = new GlobalData();

  constructor(private readonly http: HttpClient) {}

  query(): Observable<GlobalData> {
    
    console.log('calling GlobalsService.query()');

    return this.http.get<GlobalData>("/global-data");
  }
}
