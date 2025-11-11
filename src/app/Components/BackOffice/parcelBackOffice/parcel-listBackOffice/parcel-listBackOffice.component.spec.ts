import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelListBackOfficeComponent } from './parcel-listBackOffice.component';

describe('ParcelListComponent', () => {
  let component: ParcelListBackOfficeComponent;
  let fixture: ComponentFixture<ParcelListBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelListBackOfficeComponent]
    });
    fixture = TestBed.createComponent(ParcelListBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
