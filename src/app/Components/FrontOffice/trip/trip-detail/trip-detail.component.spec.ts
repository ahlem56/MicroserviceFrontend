import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailFrontOfficeComponent } from './trip-detail.component';

describe('TripDetailComponent', () => {
  let component: TripDetailFrontOfficeComponent;
  let fixture: ComponentFixture<TripDetailFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripDetailFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(TripDetailFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
