import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  username?: string;
  password?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  register(user: User): Observable<any> {
    console.log(user)
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(user: User): Observable<any> {
    console.log(user)
    return this.http.post(`${this.baseUrl}/login`, user);
  }

  runCrew(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/run-crew`, { user_id: userId });
  }

  getCrewResult(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-crew-result/${userId}`);
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/chat`, { message });
  }
}
