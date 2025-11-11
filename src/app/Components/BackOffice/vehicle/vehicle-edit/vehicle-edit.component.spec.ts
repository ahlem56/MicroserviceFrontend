import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditBackOfficeComponent } from './vehicle-edit.component';

describe('VehicleEditComponent', () => {
  let component: VehicleEditBackOfficeComponent;
  let fixture: ComponentFixture<VehicleEditBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleEditBackOfficeComponent]
    });
    fixture = TestBed.createComponent(VehicleEditBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
