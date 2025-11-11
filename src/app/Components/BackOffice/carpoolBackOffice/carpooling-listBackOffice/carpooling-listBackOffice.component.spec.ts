import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingListBackOfficeComponent } from './carpooling-listBackOffice.component';

describe('CarpoolingListComponent', () => {
  let component: CarpoolingListBackOfficeComponent;
  let fixture: ComponentFixture<CarpoolingListBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarpoolingListBackOfficeComponent]
    });
    fixture = TestBed.createComponent(CarpoolingListBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
