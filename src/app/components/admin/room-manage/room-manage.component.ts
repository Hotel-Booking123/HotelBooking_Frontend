import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RoomService } from '../../../core/services/room.service';
import { HotelService } from '../../../core/services/hotel.service';
import { Room, Hotel } from 'src/app/shared/models/model';

@Component({
  selector: 'app-room-manage',
  templateUrl: './room-manage.component.html',
  styleUrls: ['./room-manage.component.css']
})
export class RoomManageComponent implements OnInit {
  rooms: Room[] = [];
  hotels: Hotel[] = [];
  showForm = false;
  editingId: number | null = null;
  selectedHotelId: number | null = null; // store as number, null when not selected
  roomForm = this.fb.group({
    roomNumber: ['', Validators.required],
    type: ['', Validators.required],
    pricePerNight: [0, Validators.required],
    maxOccupancy: [0, Validators.required]
  });

  constructor(
    private roomService: RoomService,
    private hotelService: HotelService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getAll().subscribe(data => this.hotels = data);
  }

  loadRooms(hotelId: number): void {
    this.selectedHotelId = hotelId;
    // Reset form and hide it when hotel changes
    this.resetForm();
    this.roomService.getByHotel(hotelId).subscribe(data => this.rooms = data);
  }

  // Called when user clicks "Add Room" – only if hotel selected
  openForm(): void {
    if (!this.selectedHotelId) {
      alert('Please select a hotel first');
      return;
    }
    this.showForm = true;
  }

  save(): void {
    if (!this.selectedHotelId) {
      alert('Hotel not selected');
      return;
    }
    if (this.editingId) {
      this.roomService.update(this.selectedHotelId, this.editingId, this.roomForm.value).subscribe(() => {
        this.loadRooms(this.selectedHotelId!);
        this.resetForm();
      });
    } else {
      this.roomService.create(this.selectedHotelId, this.roomForm.value).subscribe(() => {
        this.loadRooms(this.selectedHotelId!);
        this.resetForm();
      });
    }
  }

  edit(room: Room): void {
    if (!this.selectedHotelId) return;
    this.editingId = room.id;
    this.roomForm.patchValue(room);
    this.showForm = true;
  }

  delete(roomId: number): void {
    if (!this.selectedHotelId) return;
    if (confirm('Delete room?')) {
      this.roomService.delete(this.selectedHotelId, roomId).subscribe(() => this.loadRooms(this.selectedHotelId!));
    }
  }

  resetForm(): void {
    this.roomForm.reset();
    this.editingId = null;
    this.showForm = false;
  }
}