import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTrackFrontOfficeComponent } from './parcel-track.component';

describe('ParcelTrackComponent', () => {
  let component: ParcelTrackFrontOfficeComponent;
  let fixture: ComponentFixture<ParcelTrackFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelTrackFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ParcelTrackFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
