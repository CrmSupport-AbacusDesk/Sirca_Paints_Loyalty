import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCouponPointsComponent } from './add-coupon-points.component';

describe('AddCouponPointsComponent', () => {
  let component: AddCouponPointsComponent;
  let fixture: ComponentFixture<AddCouponPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCouponPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCouponPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
