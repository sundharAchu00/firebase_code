
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  role = 'employee'; // Default role
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post<any>('http://localhost:5001/register', {
      username: this.username,
      password: this.password,
      role: this.role
    }).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        this.errorMessage = 'Registration failed';
      }
    );
  }
}

    