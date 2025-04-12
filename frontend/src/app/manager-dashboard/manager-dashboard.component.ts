import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.scss'
})
export class ManagerDashboardComponent implements OnInit {
  userId: number | null = null;
  crewResult: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.userId = JSON.parse(user).userId;
    }
  }

  runCrew(): void {
    if (this.userId) {
      this.apiService.runCrew(this.userId).subscribe({
        next: () => {
          this.apiService.getCrewResult(this.userId!).subscribe({
            next: (result) => {
              this.crewResult = result.result;
            },
            error: (error) => console.error('Error getting crew result', error)
          });
        },
        error: (error) => console.error('Error running crew', error)
      });
    }
  }
}
