import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface ErrorType {
  status: number;
  title: string;
  message: string;
  icon: string;
}

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule]
})
export class ErrorPageComponent implements OnInit {
  errorType: ErrorType = {
    status: 404,
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist or has been moved.',
    icon: 'search_off'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const status = params.get('status');
      if (status) {
        this.setErrorType(parseInt(status, 10));
      }
    });
  }

  setErrorType(status: number): void {
    switch (status) {
      case 401:
        this.errorType = {
          status: 401,
          title: 'Unauthorized',
          message: 'You need to be logged in to access this resource.',
          icon: 'lock'
        };
        break;
      case 403:
        this.errorType = {
          status: 403,
          title: 'Forbidden',
          message: 'You don\'t have permission to access this resource.',
          icon: 'no_accounts'
        };
        break;
      case 500:
        this.errorType = {
          status: 500,
          title: 'Server Error',
          message: 'Something went wrong on our server. Please try again later.',
          icon: 'error'
        };
        break;
      case 503:
        this.errorType = {
          status: 503,
          title: 'Service Unavailable',
          message: 'The service is temporarily unavailable. Please try again later.',
          icon: 'cloud_off'
        };
        break;
      default:
        this.errorType = {
          status: 404,
          title: 'Page Not Found',
          message: 'The page you are looking for does not exist or has been moved.',
          icon: 'search_off'
        };
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
  
  goBack(): void {
    window.history.back();
  }
} 