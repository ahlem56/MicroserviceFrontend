import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFrontOfficeComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatFrontOfficeComponent;
  let fixture: ComponentFixture<ChatFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ChatFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
