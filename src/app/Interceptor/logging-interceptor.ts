import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent , HttpEventType} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap, map } from 'rxjs/operators';

export class LoggingInterceptor implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        console.log('Outgoing request');
        console.log(req.url);
       return next.handle(req).pipe(tap(
           event => { 
               if (event.type === HttpEventType.Response) {
                    console.log('Response arrived, body data:' + event.body);
               }
           }
       ))
   }
}
