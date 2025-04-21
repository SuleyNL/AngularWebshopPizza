import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isAuthenticated = false;
  currentUser: User | null = null;
  private subscriptions: Subscription[] = [];
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.subscriptions.push(
      this.authService.isAuthenticated$.subscribe(
        isAuthenticated => {
          this.isAuthenticated = isAuthenticated;
        }
      )
    );
    
    // Subscribe to current user updates
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(
        user => {
          this.currentUser = user;
        }
      )
    );
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
} 