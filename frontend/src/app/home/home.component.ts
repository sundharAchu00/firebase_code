
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <h2>Welcome to RoleWise!</h2>
    <p>You are logged in as: {{ role }}</p>
    <button (click)="logout()">Logout</button>
  `,
  styleUrls: []
})
export class HomeComponent implements OnInit {
  role: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.role = localStorage.getItem('role') || 'Unknown';
  }

  logout() {
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}

    