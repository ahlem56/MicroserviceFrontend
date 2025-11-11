import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripListBackOfficeComponent } from './trip-listBackOffice.component';

describe('TripListComponent', () => {
  let component: TripListBackOfficeComponent;
  let fixture: ComponentFixture<TripListBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripListBackOfficeComponent]
    });
    fixture = TestBed.createComponent(TripListBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
