import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailFrontOfficeComponent } from './event-detail.component';

describe('EventDetailComponent', () => {
  let component: EventDetailFrontOfficeComponent;
  let fixture: ComponentFixture<EventDetailFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(EventDetailFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
