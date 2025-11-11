import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageCreationFrontOfficeComponent } from './chat-message-creation.component';

describe('ChatMessageCreationComponent', () => {
  let component: ChatMessageCreationFrontOfficeComponent;
  let fixture: ComponentFixture<ChatMessageCreationFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatMessageCreationFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ChatMessageCreationFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
