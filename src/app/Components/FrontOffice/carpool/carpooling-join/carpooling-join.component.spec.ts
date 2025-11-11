import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingJoinFrontOfficeComponent } from './carpooling-join.component';

describe('CarpoolingJoinComponent', () => {
  let component: CarpoolingJoinFrontOfficeComponent;
  let fixture: ComponentFixture<CarpoolingJoinFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarpoolingJoinFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(CarpoolingJoinFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
