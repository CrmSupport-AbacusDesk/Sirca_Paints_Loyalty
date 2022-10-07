import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlumberMeetDataComponent } from './plumber-meet-data.component';

describe('PlumberMeetDataComponent', () => {
  let component: PlumberMeetDataComponent;
  let fixture: ComponentFixture<PlumberMeetDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlumberMeetDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlumberMeetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
