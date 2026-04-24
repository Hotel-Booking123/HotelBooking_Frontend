import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from 'src/app/shared/models/model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  userName: string = '';
  userEmail: string = '';
  recentBookings: Booking[] = [];
  loading = true;
  errorMessage = '';
  private subscription: Subscription | null = null;
  
  // Make auth public so template can access it
  public auth: AuthService;  // ✅ Added this line

  constructor(
    private authService: AuthService,  // Changed from private auth
    private bookingService: BookingService,
    private router: Router
  ) {
    this.auth = authService;  // Assign to public property
  }

  ngOnInit(): void {
    // Subscribe to user changes for real-time updates
    this.subscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.fullName || 'User';
        this.userEmail = user.email || '';
        console.log('User dashboard - User loaded:', this.userName);
      }
    });
    
    // Check if token exists before loading
    const token = this.authService.getToken();
    console.log('UserDashboard - Token exists:', !!token);
    
    if (!token) {
      console.error('No token found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadRecentBookings();
  }

  loadRecentBookings(): void {
    this.loading = true;
    this.errorMessage = '';
    console.log('Loading recent bookings...');
    
    this.bookingService.getHistory().subscribe({
      next: (data) => {
        console.log('Bookings loaded successfully:', data);
        // Ensure data is an array before slicing
        this.recentBookings = Array.isArray(data) ? data.slice(0, 5) : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        
        this.loading = false;
        
        if (err.status === 401) {
          this.errorMessage = 'Session expired. Please login again.';
          console.log('Unauthorized - Token may be invalid or expired');
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err.status === 404) {
          this.errorMessage = 'No bookings found.';
          this.recentBookings = [];
        } else {
          this.errorMessage = err.error?.message || 'Failed to load bookings. Please try again.';
        }
      }
    });
  }

  goToHotels(): void {
    this.router.navigate(['/hotels']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  viewAllBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}