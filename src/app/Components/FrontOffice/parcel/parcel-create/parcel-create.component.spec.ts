import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelCreateFrontOfficeComponent } from './parcel-create.component';

describe('ParcelCreateComponent', () => {
  let component: ParcelCreateFrontOfficeComponent;
  let fixture: ComponentFixture<ParcelCreateFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelCreateFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ParcelCreateFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
