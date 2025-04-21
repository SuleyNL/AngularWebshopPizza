import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contact-container">
      <div class="container">
        <h2>Contact Us</h2>
        
        <div class="contact-content">
          <div class="contact-info">
            <h3>Visit Us</h3>
            <p><strong>Address:</strong> 123 Pizza Street, New York, NY 10001</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Email:</strong> info&#64;pizzadeliziosa.com</p>
            <h3>Hours</h3>
            <p><strong>Monday - Thursday:</strong> 11:00 AM - 10:00 PM</p>
            <p><strong>Friday - Saturday:</strong> 11:00 AM - 11:00 PM</p>
            <p><strong>Sunday:</strong> 12:00 PM - 9:00 PM</p>
          </div>
          
          <div class="contact-form">
            <h3>Send Us a Message</h3>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" formControlName="name" class="form-control">
                <div *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched" class="error-message">
                  Name is required
                </div>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" formControlName="email" class="form-control">
                <div *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched" class="error-message">
                  Valid email is required
                </div>
              </div>
              
              <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" formControlName="message" rows="5" class="form-control"></textarea>
                <div *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched" class="error-message">
                  Message is required
                </div>
              </div>
              
              <button type="submit" class="submit-button" [disabled]="contactForm.invalid">Send Message</button>
            </form>
            
            <div *ngIf="submitted" class="success-message">
              Thank you for your message! We'll get back to you soon.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      padding: 40px 0;
    }
    
    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #d32f2f;
      font-family: 'Playfair Display', serif;
    }
    
    .contact-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    @media (min-width: 768px) {
      .contact-content {
        flex-direction: row;
      }
    }
    
    .contact-info, .contact-form {
      flex: 1;
    }
    
    h3 {
      color: #d32f2f;
      margin-top: 0;
      font-family: 'Playfair Display', serif;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    textarea.form-control {
      resize: vertical;
    }
    
    .error-message {
      color: #d32f2f;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .success-message {
      background-color: #4caf50;
      color: white;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    .submit-button {
      background-color: #d32f2f;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 12px 20px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .submit-button:hover {
      background-color: #b71c1c;
    }
    
    .submit-button:disabled {
      background-color: #ddd;
      cursor: not-allowed;
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  
  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }
  
  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      // In a real app, you would send this data to a backend service
      this.submitted = true;
      this.contactForm.reset();
    }
  }
} 