import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingDetailFrontOfficeComponent } from './carpooling-detail.component';

describe('CarpoolingDetailComponent', () => {
  let component: CarpoolingDetailFrontOfficeComponent;
  let fixture: ComponentFixture<CarpoolingDetailFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarpoolingDetailFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(CarpoolingDetailFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
