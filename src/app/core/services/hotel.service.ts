import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hotel } from 'src/app/shared/models/model';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private apiUrl = `${environment.apiUrl}/Hotels`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl).pipe(
      map(response => response as Hotel[] || [])
    );
  }

  search(params: any): Observable<Hotel[]> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) httpParams = httpParams.set(key, params[key]);
    });
    return this.http.get<Hotel[]>(`${this.apiUrl}/search`, { params: httpParams }).pipe(
      map(response => response as Hotel[] || [])
    );
  }

  getById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`).pipe(
      map(response => response as Hotel)
    );
  }

  create(data: any): Observable<Hotel> {
    return this.http.post<Hotel>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}