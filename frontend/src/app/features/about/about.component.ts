import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <div class="container">
        <h2>About Pizza Deliziosa</h2>
        <div class="about-content">
          <div class="about-image">
            <img src="assets/images/about-pizza.jpg" alt="Pizza Deliziosa" onerror="this.src='https://via.placeholder.com/400x300?text=Pizza+Deliziosa'">
          </div>
          <div class="about-text">
            <h3>Our Story</h3>
            <p>
              Welcome to Pizza Deliziosa, where passion meets tradition. Our journey began in the heart of Naples, 
              where our founder learned the art of pizza-making from his grandfather.
            </p>
            <p>
              Since opening our doors in 2010, we've been committed to bringing the authentic taste of Italy 
              to your table. We use only the freshest ingredients, including imported Italian flour, 
              San Marzano tomatoes, and locally sourced produce.
            </p>
            <h3>Our Mission</h3>
            <p>
              At Pizza Deliziosa, our mission is simple: to create delicious, authentic Italian pizza 
              that brings people together. We believe that good food has the power to create memorable moments, 
              and we're honored to be a part of your dining experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 40px 0;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #d32f2f;
      font-family: 'Playfair Display', serif;
    }
    
    .about-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    @media (min-width: 768px) {
      .about-content {
        flex-direction: row;
      }
    }
    
    .about-image {
      flex: 1;
    }
    
    .about-image img {
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .about-text {
      flex: 1;
    }
    
    h3 {
      color: #d32f2f;
      margin-top: 0;
      font-family: 'Playfair Display', serif;
    }
    
    p {
      line-height: 1.6;
      margin-bottom: 20px;
    }
  `]
})
export class AboutComponent {} 