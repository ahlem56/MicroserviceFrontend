import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingCreateFrontOfficeComponent } from './carpooling-create.component';

describe('CarpoolingCreateComponent', () => {
  let component: CarpoolingCreateFrontOfficeComponent;
  let fixture: ComponentFixture<CarpoolingCreateFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarpoolingCreateFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(CarpoolingCreateFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
