import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HotelService } from '../../core/services/hotel.service';
import { Hotel } from 'src/app/shared/models/model';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: Hotel[] = [];
  searchForm = this.fb.group({
    location: [''],
    checkIn: [''],
    checkOut: [''],
    minPrice: [''],
    maxPrice: ['']
  });

  constructor(
    private hotelService: HotelService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getAll().subscribe(data => this.hotels = data);
  }

  search(): void {
    this.hotelService.search(this.searchForm.value).subscribe(data => this.hotels = data);
  }
}
