import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTeamDetailComponent } from './sale-team-detail.component';

describe('SaleTeamDetailComponent', () => {
  let component: SaleTeamDetailComponent;
  let fixture: ComponentFixture<SaleTeamDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleTeamDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTeamDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
