import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from 'src/app/shared/models/model';

@Component({
  selector: 'app-booking-manage',
  templateUrl: './booking-manage.component.html',
  styleUrls: ['./booking-manage.component.css']
})
export class BookingManageComponent implements OnInit {
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  statusFilter: string = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAllBookings().subscribe(data => {
      this.bookings = data;
      console.log('Bookings loaded:', this.bookings);
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.bookings];

    // Filter by status only
    if (this.statusFilter) {
      filtered = filtered.filter(b => b.status === this.statusFilter);
    }

    this.filteredBookings = filtered;
  }
}