import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelManageComponent } from './hotel-manage.component';

describe('HotelManageComponent', () => {
  let component: HotelManageComponent;
  let fixture: ComponentFixture<HotelManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotelManageComponent]
    });
    fixture = TestBed.createComponent(HotelManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
