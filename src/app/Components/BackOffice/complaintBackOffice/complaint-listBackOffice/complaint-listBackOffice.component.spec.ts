import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintListBackOfficeComponent } from './complaint-listBackOffice.component';

describe('ComplaintListComponent', () => {
  let component: ComplaintListBackOfficeComponent;
  let fixture: ComponentFixture<ComplaintListBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintListBackOfficeComponent]
    });
    fixture = TestBed.createComponent(ComplaintListBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
