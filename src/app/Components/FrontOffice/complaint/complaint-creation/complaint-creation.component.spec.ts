import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintCreationFrontOfficeComponent } from './complaint-creation.component';

describe('ComplaintCreationComponent', () => {
  let component: ComplaintCreationFrontOfficeComponent;
  let fixture: ComponentFixture<ComplaintCreationFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintCreationFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ComplaintCreationFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
