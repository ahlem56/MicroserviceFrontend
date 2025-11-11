import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventListFrontOfficeComponent } from './event-list.component';

describe('EventListComponent', () => {
  let component: EventListFrontOfficeComponent;
  let fixture: ComponentFixture<EventListFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventListFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(EventListFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
