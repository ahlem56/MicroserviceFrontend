import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelTrackDriverInterfaceComponent } from './parcel-track.component';

describe('ParcelTrackComponent', () => {
  let component: ParcelTrackDriverInterfaceComponent;
  let fixture: ComponentFixture<ParcelTrackDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelTrackDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(ParcelTrackDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
