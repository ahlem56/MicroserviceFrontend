import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTravelHistoryComponent } from './vehicle-travel-history.component';

describe('VehicleTravelHistoryComponent', () => {
  let component: VehicleTravelHistoryComponent;
  let fixture: ComponentFixture<VehicleTravelHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTravelHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleTravelHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
