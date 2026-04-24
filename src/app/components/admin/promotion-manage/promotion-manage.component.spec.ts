import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionManageComponent } from './promotion-manage.component';

describe('PromotionManageComponent', () => {
  let component: PromotionManageComponent;
  let fixture: ComponentFixture<PromotionManageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionManageComponent]
    });
    fixture = TestBed.createComponent(PromotionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
