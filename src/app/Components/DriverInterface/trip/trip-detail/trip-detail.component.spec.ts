import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailDriverInterfaceComponent } from './trip-detail.component';

describe('TripDetailComponent', () => {
  let component: TripDetailDriverInterfaceComponent;
  let fixture: ComponentFixture<TripDetailDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripDetailDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(TripDetailDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
