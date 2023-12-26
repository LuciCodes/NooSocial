import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApiInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // this for localhost development with mocks, converting
    // /api/object   
    // into
    // /assets/api/object.json

    const apiReq = req.clone({ url: `/assets/api${req.url}.json` });
    return next.handle(apiReq);
  }
}
