import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelListFrontOfficeComponent } from './parcel-list.component';

describe('ParcelListComponent', () => {
  let component: ParcelListFrontOfficeComponent;
  let fixture: ComponentFixture<ParcelListFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelListFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ParcelListFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
