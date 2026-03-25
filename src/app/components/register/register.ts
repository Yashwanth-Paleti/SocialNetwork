import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatCardModule, MatInputModule,
    MatButtonModule, MatFormFieldModule, MatIconModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  get passwordValid(): boolean { return this.password.length >= 6; }
  get hasUppercase(): boolean { return /[A-Z]/.test(this.password); }
  get hasNumber(): boolean { return /[0-9]/.test(this.password); }
  get passwordsMatch(): boolean { return this.password === this.confirmPassword && this.confirmPassword.length > 0; }

  async register(): Promise<void> {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }
    if (!this.passwordValid || !this.hasUppercase || !this.hasNumber) {
      this.errorMessage = 'Password does not meet requirements.';
      return;
    }
    if (!this.passwordsMatch) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.register(this.email, this.password, this.name);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage = err.message || 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
