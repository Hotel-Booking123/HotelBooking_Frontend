import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const requiredRole = route.data['role'];

    if (!isLoggedIn) {
      // Store the attempted URL for redirecting after login
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (requiredRole && this.authService.getUserRole() !== requiredRole) {
      // User doesn't have required role, redirect to home page
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}