import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Handle API errors in component-specific error handling
   * This complements the global error interceptor
   */
  handleError(error: HttpErrorResponse, showSnackbar = true): void {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'You need to be logged in to perform this action';
          break;
        case 403:
          errorMessage = 'You don\'t have permission to perform this action';
          break;
        case 404:
          errorMessage = 'The requested resource was not found';
          break;
        case 400:
          errorMessage = this.getBadRequestErrorMessage(error);
          break;
        case 422:
          errorMessage = this.getValidationErrorMessage(error);
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
      }
    }

    // Log error for debugging
    console.error('API Error:', error);
    
    // Show a snackbar message if requested
    if (showSnackbar) {
      this.showErrorSnackbar(errorMessage);
    }
    
    return;
  }
  
  /**
   * Formats a more user-friendly message for a 400 Bad Request error
   */
  private getBadRequestErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    return 'Invalid request. Please check your input.';
  }
  
  /**
   * Extracts validation errors from a 422 response
   */
  private getValidationErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.errors) {
      // Try to extract validation messages
      const errorMessages = Object.values(error.error.errors).flat();
      if (errorMessages.length > 0) {
        return errorMessages.join('. ');
      }
    }
    
    return 'Validation failed. Please check your input.';
  }
  
  /**
   * Show an error snackbar with consistent styling
   */
  showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
} 