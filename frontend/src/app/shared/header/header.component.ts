import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../api.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.isLoggedIn = true;
      this.userRole = JSON.parse(user).role;
    } else {
      this.isLoggedIn = false;
      this.userRole = null;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.userRole = null;
    this.router.navigate(['/login']);
  }
}
