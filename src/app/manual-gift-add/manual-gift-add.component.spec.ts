import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualGiftAddComponent } from './manual-gift-add.component';

describe('ManualGiftAddComponent', () => {
  let component: ManualGiftAddComponent;
  let fixture: ComponentFixture<ManualGiftAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualGiftAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualGiftAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
