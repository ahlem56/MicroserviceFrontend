import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingListFrontOfficeComponent } from './carpooling-list.component';

describe('CarpoolingListComponent', () => {
  let component: CarpoolingListFrontOfficeComponent;
  let fixture: ComponentFixture<CarpoolingListFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarpoolingListFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(CarpoolingListFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
