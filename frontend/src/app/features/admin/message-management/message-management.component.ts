import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Message } from '../../../core/models/message.model';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-message-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-management.component.html',
  styleUrls: ['./message-management.component.scss']
})
export class MessageManagementComponent implements OnInit {
  messages: Message[] = [];
  loading = false;
  error = '';

  constructor(
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.loading = true;
    this.messageService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load messages. Please try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  viewMessage(id: number | undefined): void {
    if (typeof id === 'number') {
      this.router.navigate(['/admin/messages/edit', id]);
      
      // Also mark the message as read
      this.messageService.markAsRead(id).subscribe({
        next: () => {
          // Update the local copy of the message to show as read
          const messageIndex = this.messages.findIndex(m => m.id === id);
          if (messageIndex !== -1) {
            this.messages[messageIndex].isRead = true;
          }
        },
        error: (err) => {
          console.error('Failed to mark message as read:', err);
        }
      });
    } else {
      this.error = 'Cannot view message without a valid ID.';
    }
  }

  deleteMessage(id: number | undefined): void {
    if (typeof id !== 'number') {
      this.error = 'Cannot delete message without a valid ID.';
      return;
    }
    
    if (confirm('Are you sure you want to delete this message?')) {
      this.messageService.deleteMessage(id).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => m.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete message. Please try again.';
          console.error(err);
        }
      });
    }
  }
}
