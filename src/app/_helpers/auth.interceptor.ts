import { Injectable } from '@angular/core';
import {  HttpRequest,  HttpHandler,  HttpEvent,  HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authToken = localStorage.getItem('token')!
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer `+authToken
            }
        });

        return next.handle(request);
    }
}