import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelListDriverInterfaceComponent } from './parcel-list.component';

describe('ParcelListComponent', () => {
  let component: ParcelListDriverInterfaceComponent;
  let fixture: ComponentFixture<ParcelListDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParcelListDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(ParcelListDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
