import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  editUser(id: number | undefined): void {
    if (typeof id === 'number') {
      this.router.navigate(['/admin/users/edit', id]);
    } else {
      this.error = 'Cannot edit user without a valid ID.';
    }
  }

  deleteUser(id: number | undefined): void {
    if (typeof id !== 'number') {
      this.error = 'Cannot delete user without a valid ID.';
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete user. Please try again.';
          console.error(err);
        }
      });
    }
  }
}
