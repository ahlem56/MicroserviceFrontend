import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelDetailFrontOfficeComponent } from './parcel-detail.component';

describe('ParcelDetailComponent', () => {
  let component: ParcelDetailFrontOfficeComponent;
  let fixture: ComponentFixture<ParcelDetailFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelDetailFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ParcelDetailFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
