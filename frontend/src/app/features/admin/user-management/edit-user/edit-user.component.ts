import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  userId: number;
  isNewUser = false;
  loading = false;
  submitted = false;
  error = '';
  roles = ['CUSTOMER', 'ADMIN'];


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.pattern(/^(\+31|0)[1-9]\d{8}$/)]], // Dutch phone format
      role: ['CUSTOMER', Validators.required], // Default role is CUSTOMER
      password: [''] // Optional for creating new users
    });
    
    
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.isNewUser = this.userId === 0;
  }

  ngOnInit(): void {
    if (!this.isNewUser) {
      this.loadUser();
    }
  }

  loadUser(): void {
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        console.log('Loaded user:', user);
        // Remove password from form for existing users
        const { password, ...userWithoutPassword } = this.userForm.value;
        this.userForm.patchValue(user);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user details. Please try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.userForm.invalid) {
      return;
    }
    
    this.loading = true;
    const user: User = this.userForm.value;
    
    console.log('Submitting user with role:', user.role);
    
    if (this.isNewUser) {
      this.userService.createUser(user).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.error = 'Failed to create user. Please try again.';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.userService.updateUser(this.userId, user).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.error = 'Failed to update user. Please try again.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  // Helper method to check for form validation errors
  get f() { return this.userForm.controls; }
  
  // Helper method to determine if a field is invalid and touched/submitted
  isFieldInvalid(field: string): boolean {
    const formControl = this.userForm.get(field);
    return !!(formControl && formControl.invalid && (formControl.dirty || formControl.touched || this.submitted));
  }
  
  // Cancel editing and return to user list
  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
