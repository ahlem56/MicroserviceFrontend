import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpoolingOfferFrontOfficeComponent } from './carpooling-offer.component';

describe('CarpoolingOfferComponent', () => {
  let component: CarpoolingOfferFrontOfficeComponent;
  let fixture: ComponentFixture<CarpoolingOfferFrontOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarpoolingOfferFrontOfficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarpoolingOfferFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
