import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripListFrontOfficeComponent } from './trip-list.component';

describe('TripListComponent', () => {
  let component: TripListFrontOfficeComponent;
  let fixture: ComponentFixture<TripListFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripListFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(TripListFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
