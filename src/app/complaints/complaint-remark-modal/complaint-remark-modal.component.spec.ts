import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintRemarkModalComponent } from './complaint-remark-modal.component';

describe('ComplaintRemarkModalComponent', () => {
  let component: ComplaintRemarkModalComponent;
  let fixture: ComponentFixture<ComplaintRemarkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintRemarkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintRemarkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
