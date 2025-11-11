import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCreateFrontOfficeComponent } from './trip-create.component';

describe('TripCreateComponent', () => {
  let component: TripCreateFrontOfficeComponent;
  let fixture: ComponentFixture<TripCreateFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripCreateFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(TripCreateFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
