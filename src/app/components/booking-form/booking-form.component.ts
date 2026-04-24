import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { Room } from 'src/app/shared/models/model';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  room: Room | null = null;
  checkIn: string = '';
  checkOut: string = '';
  totalPrice: number = 0;
  nights: number = 0;
  bookingForm: FormGroup;
  errorMessage = '';
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    // Get room from navigation state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { room: Room };
    
    if (state?.room) {
      this.room = state.room;
    } else {
      this.errorMessage = 'Booking information missing. Please go back and select a room again.';
    }
    
    this.checkIn = this.route.snapshot.queryParams['checkIn'] || '';
    this.checkOut = this.route.snapshot.queryParams['checkOut'] || '';
    this.bookingForm = this.fb.group({
      discountCode: ['']
    });
  }

  ngOnInit(): void {
    if (!this.room) {
      return;
    }
    if (!this.checkIn || !this.checkOut) {
      this.errorMessage = 'Missing check-in or check-out dates. Please go back and select dates.';
      return;
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    if (this.room && this.checkIn && this.checkOut) {
      const checkInDate = new Date(this.checkIn);
      const checkOutDate = new Date(this.checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      this.nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.totalPrice = this.nights * this.room.pricePerNight;
    }
  }

  onSubmit(): void {
    if (!this.room) return;
    if (this.submitting) return;
    
    this.submitting = true;
    const bookingData = {
      roomId: this.room.id,
      checkInDate: this.checkIn,
      checkOutDate: this.checkOut,
      discountCode: this.bookingForm.value.discountCode || null
    };
    
    this.bookingService.create(bookingData).subscribe({
      next: () => {
        alert('Booking successful!');
        this.router.navigate(['/user-dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Booking failed. Please try again.';
        this.submitting = false;
      }
    });
  }
}