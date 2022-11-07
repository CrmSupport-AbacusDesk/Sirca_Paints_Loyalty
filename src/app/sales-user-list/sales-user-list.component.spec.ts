import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesUserListComponent } from './sales-user-list.component';

describe('SalesUserListComponent', () => {
  let component: SalesUserListComponent;
  let fixture: ComponentFixture<SalesUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
