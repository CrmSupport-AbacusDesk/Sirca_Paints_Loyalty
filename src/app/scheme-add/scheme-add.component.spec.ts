import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeAddComponent } from './scheme-add.component';

describe('SchemeAddComponent', () => {
  let component: SchemeAddComponent;
  let fixture: ComponentFixture<SchemeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
