import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDetailsFrontOfficeComponent } from './complaint-details.component';

describe('ComplaintDetailsComponent', () => {
  let component: ComplaintDetailsFrontOfficeComponent;
  let fixture: ComponentFixture<ComplaintDetailsFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintDetailsFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ComplaintDetailsFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
