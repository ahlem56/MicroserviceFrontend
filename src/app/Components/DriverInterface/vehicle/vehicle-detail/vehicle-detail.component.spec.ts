import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailDriverInterfaceComponent } from './vehicle-detail.component';

describe('VehicleDetailComponent', () => {
  let component: VehicleDetailDriverInterfaceComponent;
  let fixture: ComponentFixture<VehicleDetailDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleDetailDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(VehicleDetailDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
