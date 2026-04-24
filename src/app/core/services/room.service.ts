import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room } from 'src/app/shared/models/model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = `${environment.apiUrl}/hotels`;

  constructor(private http: HttpClient) {}

  getByHotel(hotelId: number, checkIn?: string, checkOut?: string): Observable<Room[]> {
    let params = new HttpParams();
    if (checkIn && checkOut) {
      params = params.set('checkIn', checkIn).set('checkOut', checkOut);
    }
    return this.http.get<Room[]>(`${this.apiUrl}/${hotelId}/rooms`, { params }).pipe(
      map(response => response as Room[] || [])
    );
  }

  getById(roomId: number): Observable<Room> {
    return this.http.get<Room>(`${environment.apiUrl}/rooms/${roomId}`).pipe(
      map(response => response as Room)
    );
  }

  create(hotelId: number, data: any): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/${hotelId}/rooms`, data);
  }

  update(hotelId: number, roomId: number, data: any): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${hotelId}/rooms/${roomId}`, data);
  }

  delete(hotelId: number, roomId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${hotelId}/rooms/${roomId}`);
  }
}