import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  loginForm!: FormGroup;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful', response);
          // Store user information in local storage
          localStorage.setItem('currentUser', JSON.stringify({ username: response.username, role: response.role }));
          // Redirect based on user role
          if (response.role === 'supervisor') {
            this.router.navigate(['/manager']);
          } else if (response.role === 'employee') {
            this.router.navigate(['/user']);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = error.error.error || 'Login failed';
        }
      });
    }
  }
}
