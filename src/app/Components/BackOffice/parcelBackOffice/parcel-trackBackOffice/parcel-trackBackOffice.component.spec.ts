import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTrackBackOfficeComponent } from './parcel-trackBackOffice.component';

describe('ParcelTrackComponent', () => {
  let component: ParcelTrackBackOfficeComponent;
  let fixture: ComponentFixture<ParcelTrackBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelTrackBackOfficeComponent]
    });
    fixture = TestBed.createComponent(ParcelTrackBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
