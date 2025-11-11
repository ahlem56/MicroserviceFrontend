import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingDetailBackOfficeComponent } from './carpooling-detailBackOffice.component';

describe('CarpoolingDetailComponent', () => {
  let component: CarpoolingDetailBackOfficeComponent;
  let fixture: ComponentFixture<CarpoolingDetailBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarpoolingDetailBackOfficeComponent]
    });
    fixture = TestBed.createComponent(CarpoolingDetailBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
