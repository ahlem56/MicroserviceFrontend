import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailBackOfficeComponent } from './vehicle-detail.component';

describe('VehicleDetailComponent', () => {
  let component: VehicleDetailBackOfficeComponent;
  let fixture: ComponentFixture<VehicleDetailBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleDetailBackOfficeComponent]
    });
    fixture = TestBed.createComponent(VehicleDetailBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
