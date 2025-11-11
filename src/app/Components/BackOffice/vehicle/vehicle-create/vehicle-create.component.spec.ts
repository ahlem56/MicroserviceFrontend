import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCreateBackOfficeComponent } from './vehicle-create.component';

describe('VehicleCreateComponent', () => {
  let component: VehicleCreateBackOfficeComponent;
  let fixture: ComponentFixture<VehicleCreateBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleCreateBackOfficeComponent]
    });
    fixture = TestBed.createComponent(VehicleCreateBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
