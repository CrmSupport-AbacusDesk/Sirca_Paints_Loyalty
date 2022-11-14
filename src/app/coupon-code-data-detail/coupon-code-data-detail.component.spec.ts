import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCodeDataDetailComponent } from './coupon-code-data-detail.component';

describe('CouponCodeDataDetailComponent', () => {
  let component: CouponCodeDataDetailComponent;
  let fixture: ComponentFixture<CouponCodeDataDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponCodeDataDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponCodeDataDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
