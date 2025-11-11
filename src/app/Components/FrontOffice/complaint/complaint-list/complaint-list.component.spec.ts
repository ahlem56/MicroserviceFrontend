import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintListFrontOfficeComponent } from './complaint-list.component';

describe('ComplaintListComponent', () => {
  let component: ComplaintListFrontOfficeComponent;
  let fixture: ComponentFixture<ComplaintListFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintListFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ComplaintListFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
