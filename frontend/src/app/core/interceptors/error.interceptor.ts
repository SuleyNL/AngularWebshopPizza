import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Only handle specific errors, not all API errors should redirect
        if (this.shouldRedirect(error)) {
          this.handleErrorRedirect(error);
        }
        
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Determine if we should redirect to an error page
   */
  private shouldRedirect(error: HttpErrorResponse): boolean {
    // Check if it's a server-side error (not a validation error)
    if (error.status === 0) {
      // Network error or server down
      return true;
    }
    
    // Only redirect for specific status codes
    return [401, 403, 404, 500, 503].includes(error.status);
  }
  
  /**
   * Handle error by redirecting to the appropriate error page
   */
  private handleErrorRedirect(error: HttpErrorResponse): void {
    switch (error.status) {
      case 0:
        // Network error or server unavailable
        this.router.navigate(['/error/503']);
        break;
      case 401:
        // Unauthorized - redirect to login if not already on an auth page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          this.router.navigate(['/error/401']);
        }
        break;
      case 403:
        // Forbidden
        this.router.navigate(['/error/403']);
        break;
      case 404:
        // Not found
        this.router.navigate(['/error/404']);
        break;
      case 500:
        // Server error
        this.router.navigate(['/error/500']);
        break;
      default:
        // Unexpected error
        console.error(`Unexpected error: ${error.status}`, error);
        this.router.navigate(['/error/500']);
        break;
    }
  }
} 