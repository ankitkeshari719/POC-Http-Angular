import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable()
export class AuthIntercepterService implements HttpInterceptor{

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
       console.log('Auth Interceptor: Request is on its way');
       const modifiedRequest = req.clone({headers: req.headers.append('Auth',"My new Auth")})
       return next.handle(modifiedRequest);
   }
}
