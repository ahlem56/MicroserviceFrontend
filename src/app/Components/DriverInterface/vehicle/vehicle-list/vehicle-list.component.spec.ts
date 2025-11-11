import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleListDriverInterfaceComponent } from './vehicle-list.component';

describe('VehicleListComponent', () => {
  let component: VehicleListDriverInterfaceComponent;
  let fixture: ComponentFixture<VehicleListDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleListDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(VehicleListDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
