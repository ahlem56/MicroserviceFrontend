import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailBackOfficeComponent } from './trip-detailBackOffice.component';

describe('TripDetailComponent', () => {
  let component: TripDetailBackOfficeComponent;
  let fixture: ComponentFixture<TripDetailBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripDetailBackOfficeComponent]
    });
    fixture = TestBed.createComponent(TripDetailBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
