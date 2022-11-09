import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponCodeDataListComponent } from './coupon-code-data-list.component';

describe('CouponCodeDataListComponent', () => {
  let component: CouponCodeDataListComponent;
  let fixture: ComponentFixture<CouponCodeDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponCodeDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponCodeDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
