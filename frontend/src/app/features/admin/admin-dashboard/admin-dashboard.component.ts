import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <div class="container">
        <h2>Admin Dashboard</h2>
        
        <div class="admin-cards">
          <div class="admin-card">
            <h3>Products</h3>
            <p>Manage pizza and other menu items</p>
            <button class="admin-button" routerLink="/admin/products">Manage Products</button>
          </div>
          
          <div class="admin-card">
            <h3>Orders</h3>
            <p>View and update customer orders</p>
            <button class="admin-button" routerLink="/admin/orders">Manage Orders</button>
          </div>
          
          <div class="admin-card">
            <h3>Users</h3>
            <p>Manage user accounts</p>
            <button class="admin-button" routerLink="/admin/users">Manage Users</button>
          </div>
        

          <div class="admin-card">
            <h3>Messages</h3>
            <p>Manage messages from customers</p>
            <button class="admin-button" routerLink="/admin/messages">Manage Messages</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 40px 0;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #d32f2f;
      font-family: 'Playfair Display', serif;
    }
    
    .admin-cards {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 20px;
    }
    
    @media (min-width: 768px) {
      .admin-cards {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (min-width: 992px) {
      .admin-cards {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
    .admin-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
      text-align: center;
      transition: transform 0.3s;
    }
    
    .admin-card:hover {
      transform: translateY(-5px);
    }
    
    h3 {
      color: #d32f2f;
      margin-top: 0;
    }
    
    .admin-button {
      background-color: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 15px;
      margin-top: 15px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .admin-button:hover {
      background-color: #0b7dda;
    }
  `]
})
export class AdminDashboardComponent {
  constructor() {}
} 