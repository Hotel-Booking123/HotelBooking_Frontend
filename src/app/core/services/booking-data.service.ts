import { Injectable } from '@angular/core';
import { Room } from 'src/app/shared/models/model';

@Injectable({ providedIn: 'root' })
export class BookingDataService {
  private selectedRoom: Room | null = null;

  setRoom(room: Room): void {
    this.selectedRoom = room;
  }

  getRoom(): Room | null {
    return this.selectedRoom;
  }

  clearRoom(): void {
    this.selectedRoom = null;
  }
}