import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualGiftListComponent } from './manual-gift-list.component';

describe('ManualGiftListComponent', () => {
  let component: ManualGiftListComponent;
  let fixture: ComponentFixture<ManualGiftListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualGiftListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualGiftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
