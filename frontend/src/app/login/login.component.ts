
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('http://localhost:5001/login', {
      username: this.username,
      password: this.password
    }).subscribe(
      response => {
        // Store the role in local storage
        localStorage.setItem('role', response.role);
        this.router.navigate(['/']);
      },
      error => {
        this.errorMessage = 'Invalid credentials';
      }
    );
  }
}

    