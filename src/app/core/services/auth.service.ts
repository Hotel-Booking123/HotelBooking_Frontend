import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName: string;
}

// Wrapper interface for API response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private tokenKey = 'access_token';
  private userKey = 'user_info';
  
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, request).pipe(
      map(response => {
        console.log('Register response:', response);
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Registration failed');
      }),
      tap(authResponse => this.handleAuthResponse(authResponse))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, request).pipe(
      map(response => {
        console.log('Login response:', response);
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Login failed');
      }),
      tap(authResponse => this.handleAuthResponse(authResponse))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserEmail(): string | null {
    const user = this.currentUserSubject.value;
    if (user?.email) return user.email;
    
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return userData.email || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value;
    if (user?.role) return user.role;
    
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return userData.role || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  getUserName(): string | null {
    const user = this.currentUserSubject.value;
    if (user?.fullName) return user.fullName;
    
    const userStr = localStorage.getItem(this.userKey);
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        return userData.fullName || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  getFullName(): string | null {
    return this.getUserName();
  }

  getUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const expiry = this.getTokenExpiration(token);
    if (expiry) {
      return expiry > Date.now();
    }
    return true;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  private handleAuthResponse(response: AuthResponse): void {
    console.log('Saving auth response:', response);
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify({
      email: response.email,
      role: response.role,
      fullName: response.fullName
    }));
    this.currentUserSubject.next(response);
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem(this.userKey);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next({
          token: token,
          email: user.email,
          role: user.role,
          fullName: user.fullName
        });
      } catch (e) {
        console.error('Error loading stored user', e);
        this.logout();
      }
    }
  }

  private getTokenExpiration(token: string): number | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}