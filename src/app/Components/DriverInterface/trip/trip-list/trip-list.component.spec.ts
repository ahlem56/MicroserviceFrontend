import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripListDriverInterfaceComponent } from './trip-list.component';

describe('TripListComponent', () => {
  let component: TripListDriverInterfaceComponent;
  let fixture: ComponentFixture<TripListDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripListDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(TripListDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
