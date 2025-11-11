import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDetailsBackOfficeComponent } from './complaint-detailsBackOffice.component';

describe('ComplaintDetailsComponent', () => {
  let component: ComplaintDetailsBackOfficeComponent;
  let fixture: ComponentFixture<ComplaintDetailsBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintDetailsBackOfficeComponent]
    });
    fixture = TestBed.createComponent(ComplaintDetailsBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
