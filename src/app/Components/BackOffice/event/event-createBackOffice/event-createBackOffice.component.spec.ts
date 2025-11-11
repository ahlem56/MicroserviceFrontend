import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCreateBackOfficeComponent } from './event-createBackOffice.component';

describe('EventCreateComponent', () => {
  let component: EventCreateBackOfficeComponent;
  let fixture: ComponentFixture<EventCreateBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventCreateBackOfficeComponent]
    });
    fixture = TestBed.createComponent(EventCreateBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
