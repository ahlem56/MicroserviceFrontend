import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAssignComponent } from './vehicle-assign.component';

describe('VehicleAssignComponent', () => {
  let component: VehicleAssignComponent;
  let fixture: ComponentFixture<VehicleAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
