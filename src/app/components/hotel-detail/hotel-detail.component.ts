import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { Room } from 'src/app/shared/models/model';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.css']
})
export class HotelDetailComponent implements OnInit {
  rooms: Room[] = [];
  hotelId: number;
  loading = false;
  availForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private roomService: RoomService
  ) {
    this.hotelId = +this.route.snapshot.params['id'];
    this.availForm = this.fb.group({
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.getByHotel(this.hotelId).subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onDateChange(): void {
    // Auto-check availability when both dates are selected and valid
    const { checkIn, checkOut } = this.availForm.value;
    if (checkIn && checkOut && this.availForm.valid) {
      this.checkAvailability();
    }
  }

  checkAvailability(): void {
    if (this.availForm.invalid) {
      return;
    }
    
    const { checkIn, checkOut } = this.availForm.value;
    
    // Validate dates
    if (new Date(checkIn) >= new Date(checkOut)) {
      alert('Check-out must be after check-in.');
      return;
    }
    
    this.loading = true;
    this.roomService.getByHotel(this.hotelId, checkIn, checkOut).subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // Called when user clicks "Book Now"
  bookRoom(room: Room): void {
    const { checkIn, checkOut } = this.availForm.value;
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates first.');
      return;
    }
    
    // Navigate to booking form with room data and dates
    this.router.navigate(['/booking', room.id], {
      queryParams: { checkIn, checkOut },
      state: { room: room }
    });
  }
}

