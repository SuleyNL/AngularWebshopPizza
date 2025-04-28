import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    console.log('Fetching all users from:', this.API_URL);
    return this.http.get<User[]>(this.API_URL)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    console.log('Updating user with role:', userData.role);
    return this.http.put<User>(`${this.API_URL}/${id}`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  createUser(user: User): Observable<User> {
    console.log('Creating user with role:', user.role);
    return this.http.post<User>(this.API_URL, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      errorMessage = error.error || `Error Code: ${error.status}, Message: ${error.message}`;
      console.error(
        `Server error - Status: ${error.status}, ` +
        `Body: ${JSON.stringify(error.error)}`
      );
    }
    
    return throwError(() => errorMessage);
  }
}
