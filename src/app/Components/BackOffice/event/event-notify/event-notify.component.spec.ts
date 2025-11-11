import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNotifyBackOfficeComponent } from './event-notify.component';

describe('EventNotifyComponent', () => {
  let component: EventNotifyBackOfficeComponent;
  let fixture: ComponentFixture<EventNotifyBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventNotifyBackOfficeComponent]
    });
    fixture = TestBed.createComponent(EventNotifyBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
