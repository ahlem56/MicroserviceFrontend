import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleListBackOfficeComponent } from './vehicle-list.component';

describe('VehicleListComponent', () => {
  let component: VehicleListBackOfficeComponent;
  let fixture: ComponentFixture<VehicleListBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleListBackOfficeComponent]
    });
    fixture = TestBed.createComponent(VehicleListBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
