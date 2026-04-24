import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking } from 'src/app/shared/models/model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = `${environment.apiUrl}/Bookings`;

  constructor(private http: HttpClient) { }

  create(data: any): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, data).pipe(
      map(response => response as Booking)
    );
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/all`).pipe(
      map(response => response as Booking[] || [])
    );
  }

  getHistory(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/history`).pipe(
      map(response => response as Booking[] || [])
    );
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`).pipe(
      map(response => response as Booking)
    );
  }

  cancel(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  rebook(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/${id}/rebook`, {});
  }
}