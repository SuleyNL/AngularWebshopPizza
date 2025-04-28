import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest, User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.isAuthenticatedSubject.next(true);
      console.log('User authenticated from storage:', this.currentUserSubject.value?.username);
    }
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    console.log('Login attempt for:', credentials.username);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials, { headers })
      .pipe(
        tap(response => {
          console.log('Login successful, received token and user data:', response);
          localStorage.setItem(this.TOKEN_KEY, response.token);
          
          const user: User = {
            id: response.id, // Make sure this is included in the response
            username: response.username,
            role: response.role,
            email: '',  // These fields would be populated in a real app with a profile endpoint
            firstName: '',
            lastName: ''
          };
          
          console.log('Setting user role:', response.role);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError)
      );
  }

  register(registrationData: RegisterRequest): Observable<any> {
    console.log('Registration attempt for:', registrationData.username);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.API_URL}/register`, registrationData, { headers })
      .pipe(
        tap(response => console.log('Registration successful', response)),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    console.log('User logged out');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    const isUserAdmin = user !== null && user.role === 'ADMIN';
    console.log('isAdmin check:', isUserAdmin, 'Current user role:', user?.role);
    return isUserAdmin;
  }
  
  checkAuthStatus(): Observable<string> {
    return this.http.get<string>(`${this.API_URL}/status`)
      .pipe(
        tap(response => console.log('Auth status check:', response)),
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