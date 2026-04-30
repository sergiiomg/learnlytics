import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { Observable } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly tokenKey = 'learnlytics_token';

  constructor(
    private http: HttpClient,
    private apiService: Api
  ) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/auth/login`, data);
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiService.baseUrl}/auth/register`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
