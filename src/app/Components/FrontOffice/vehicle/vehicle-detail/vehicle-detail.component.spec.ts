import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailFrontOfficeComponent } from './vehicle-detail.component';

describe('VehicleDetailComponent', () => {
  let component: VehicleDetailFrontOfficeComponent;
  let fixture: ComponentFixture<VehicleDetailFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleDetailFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(VehicleDetailFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
