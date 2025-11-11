import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelDetailDriverInterfaceComponent } from './parcel-detail.component';

describe('ParcelDetailComponent', () => {
  let component: ParcelDetailDriverInterfaceComponent;
  let fixture: ComponentFixture<ParcelDetailDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelDetailDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(ParcelDetailDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
