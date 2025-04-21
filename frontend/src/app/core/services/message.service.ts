import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Message, CreateMessageRequest } from '../models/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly API_URL = `${environment.apiUrl}/api/messages`;
  
  // Mock data for testing
  private mockMessages: Message[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Order Inquiry',
      content: 'I have a question about my recent order #12345. When will it be delivered?',
      createdAt: new Date('2023-04-10T14:30:00'),
      isRead: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      subject: 'Pizza Customization',
      content: 'Do you offer gluten-free options for your pizzas?',
      createdAt: new Date('2023-04-15T09:45:00'),
      isRead: false
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      subject: 'Catering Request',
      content: 'I would like to inquire about catering services for an event next month.',
      createdAt: new Date('2023-04-18T16:20:00'),
      isRead: false
    }
  ];

  constructor(private http: HttpClient) { }

  getMessages(): Observable<Message[]> {
    // When backend is ready, uncomment this
    // return this.http.get<Message[]>(this.API_URL);
    
    // For now, return mock data
    return of(this.mockMessages);
  }

  getMessage(id: number): Observable<Message> {
    // When backend is ready, uncomment this
    // return this.http.get<Message>(`${this.API_URL}/${id}`);
    
    // For now, return mock data
    const message = this.mockMessages.find(m => m.id === id);
    return of(message as Message);
  }

  createMessage(message: CreateMessageRequest): Observable<Message> {
    // When backend is ready, uncomment this
    // return this.http.post<Message>(this.API_URL, message);
    
    // For now, return mock response
    const newMessage: Message = {
      ...message,
      id: this.mockMessages.length + 1,
      createdAt: new Date(),
      isRead: false
    };
    
    return of(newMessage);
  }

  updateMessage(id: number, message: Message): Observable<Message> {
    // When backend is ready, uncomment this
    // return this.http.put<Message>(`${this.API_URL}/${id}`, message);
    
    // For now, return mock response
    return of({ ...message, id });
  }

  deleteMessage(id: number): Observable<void> {
    // When backend is ready, uncomment this
    // return this.http.delete<void>(`${this.API_URL}/${id}`);
    
    // For now, return mock response
    return of(undefined);
  }

  markAsRead(id: number): Observable<Message> {
    // When backend is ready, uncomment this
    // return this.http.patch<Message>(`${this.API_URL}/${id}/read`, {});
    
    // For now, return mock response
    const message = this.mockMessages.find(m => m.id === id);
    if (message) {
      message.isRead = true;
    }
    return of(message as Message);
  }
}
