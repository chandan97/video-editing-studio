import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  login() {
    this.errorMessage = ''; // Purane errors clear karo

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and Password are required to sign in.';
      return;
    }

    // 🛑 THE MOCK LOGIN (Jugaad for UI Development)
    // Jab tak backend ka login API nahi banta, hum ye temporary password use karenge
    if (this.password === 'Personal@123') {
      console.log('✅ Master Password Accepted!');
      
      // Fake token save kar lete hain taaki app ko lage hum logged in hain
      localStorage.setItem('token', 'fake-jwt-token-studio-123');
      
      //alert('Login Successful! Welcome to Video Studio 🎬');
      
      // Agle step me hum Dashboard page banakar ye comment hatayenge:
      this.router.navigate(['/dashboard']); 
    } else {
      // Agar password galat dala toh error dikhayenge
      this.errorMessage = 'Invalid credentials. Please enter the correct master password.';
    }
  }
}