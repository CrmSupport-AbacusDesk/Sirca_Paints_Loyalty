import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftMasterComponent } from './gift-master.component';

describe('GiftMasterComponent', () => {
  let component: GiftMasterComponent;
  let fixture: ComponentFixture<GiftMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
