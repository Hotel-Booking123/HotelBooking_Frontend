import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token
    const token = this.authService.getToken();
    
    console.log('🔵 Interceptor - Request URL:', req.url);
    console.log('🔵 Interceptor - Token exists:', !!token);
    
    if (token) {
      console.log('🔵 Interceptor - Token (first 20 chars):', token.substring(0, 20) + '...');
      console.log('🔵 Interceptor - Adding Authorization header');
      
      // Clone the request and add the authorization header
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('🔴 Interceptor - Error response:', error.status, error.statusText);
          if (error.status === 401) {
            console.error('🔴 Interceptor - 401 Unauthorized, logging out');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    } else {
      console.warn('🟡 Interceptor - No token found for request:', req.url);
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('🔴 Interceptor - Error response:', error.status, error.statusText);
          return throwError(() => error);
        })
      );
    }
  }
}