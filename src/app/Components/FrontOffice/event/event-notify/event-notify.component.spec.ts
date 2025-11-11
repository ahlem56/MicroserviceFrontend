import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNotifyFrontOfficeComponent } from './event-notify.component';

describe('EventNotifyComponent', () => {
  let component: EventNotifyFrontOfficeComponent;
  let fixture: ComponentFixture<EventNotifyFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventNotifyFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(EventNotifyFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
