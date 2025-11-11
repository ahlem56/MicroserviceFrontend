import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelDetailBackOfficeComponent } from './parcel-detailBackOffice.component';

describe('ParcelDetailComponent', () => {
  let component: ParcelDetailBackOfficeComponent;
  let fixture: ComponentFixture<ParcelDetailBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelDetailBackOfficeComponent]
    });
    fixture = TestBed.createComponent(ParcelDetailBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
