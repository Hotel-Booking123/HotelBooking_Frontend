import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from 'src/app/shared/models/model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private bookingService: BookingService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('=== BookingHistoryComponent Initialized ===');
    console.log('Is logged in?', this.auth.isLoggedIn());
    
    if (this.auth.isLoggedIn()) {
      this.loadBookings();
    } else {
      this.errorMessage = 'Please login to view your bookings';
    }
  }

  loadBookings(): void {
    this.loading = true;
    this.errorMessage = '';
    
    console.log('Calling bookingService.getHistory()...');
    
    this.bookingService.getHistory().subscribe({
      next: (data) => {
        console.log('Data received in component:', data);
        console.log('Data type:', typeof data);
        console.log('Is data an array?', Array.isArray(data));
        
        // CRITICAL FIX: Direct assignment with explicit check
        if (data && Array.isArray(data)) {
          this.bookings = [...data]; // Create a new array copy
          console.log('Bookings assigned successfully. Count:', this.bookings.length);
        } else {
          console.error('Data is not an array:', data);
          this.bookings = [];
        }
        
        this.loading = false;
        this.cdr.detectChanges();
        
        // Log each booking
        if (this.bookings.length > 0) {
          this.bookings.forEach((booking, index) => {
            console.log(`Booking ${index + 1}:`, booking.id, booking.hotelName, booking.status);
          });
        } else {
          console.warn('No bookings to display');
        }
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to load bookings. Please try again.';
        this.cdr.detectChanges();
        
        if (err.status === 401) {
          setTimeout(() => {
            this.auth.logout();
          }, 2000);
        }
      }
    });
  }

  canRebook(booking: Booking): boolean {
    return booking.status === 'Cancelled';
  }

  canCancel(booking: Booking): boolean {
    return booking.status === 'Confirmed';
  }

  rebook(id: number): void {
    if (confirm('Do you want to rebook this room?')) {
      this.loading = true;
      this.bookingService.rebook(id).subscribe({
        next: () => {
          alert('Booking rebooked successfully!');
          this.loadBookings();
        },
        error: (err) => {
          this.loading = false;
          alert('Failed to rebook: ' + (err.error?.message || err.message));
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancel(id: number): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.loading = true;
      this.bookingService.cancel(id).subscribe({
        next: () => {
          alert('Booking cancelled successfully!');
          this.loadBookings();
        },
        error: (err) => {
          this.loading = false;
          alert('Failed to cancel: ' + (err.error?.message || err.message));
          this.cdr.detectChanges();
        }
      });
    }
  }

  getBookingReference(booking: Booking): string {
    return booking.bookingReference || `BOOK-${booking.id}`;
  }

  getHotelName(booking: Booking): string {
    return booking.hotelName || 'Unknown Hotel';
  }

  getRoomInfo(booking: Booking): string {
    const roomNumber = booking.roomNumber || '?';
    const roomType = booking.roomType || '?';
    return `${roomNumber} (${roomType})`;
  }
}