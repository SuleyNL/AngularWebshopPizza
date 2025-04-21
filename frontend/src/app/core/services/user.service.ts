import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/api/users`;
  
  // Mock data for testing
  private mockUsers: User[] = [
    {
      id: 1,
      username: 'john_doe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER'
    },
    {
      id: 2,
      username: 'jane_smith',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'CUSTOMER'
    },
    {
      id: 3,
      username: 'admin_user',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    }
  ];

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    // When backend is ready, uncomment this
    // return this.http.get<User[]>(this.API_URL);
    
    // For now, return mock data
    return of(this.mockUsers);
  }

  getUser(id: number): Observable<User> {
    // When backend is ready, uncomment this
    // return this.http.get<User>(`${this.API_URL}/${id}`);
    
    // For now, return mock data
    const user = this.mockUsers.find(u => u.id === id);
    return of(user as User);
  }

  updateUser(id: number, user: User): Observable<User> {
    // When backend is ready, uncomment this
    // return this.http.put<User>(`${this.API_URL}/${id}`, user);
    
    // For now, return mock response
    return of({ ...user, id });
  }

  deleteUser(id: number): Observable<void> {
    // When backend is ready, uncomment this
    // return this.http.delete<void>(`${this.API_URL}/${id}`);
    
    // For now, return mock response
    return of(undefined);
  }
}
