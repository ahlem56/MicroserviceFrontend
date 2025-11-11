import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageCreationDriverInterfaceComponent } from './chat-message-creation.component';

describe('ChatMessageCreationComponent', () => {
  let component: ChatMessageCreationDriverInterfaceComponent;
  let fixture: ComponentFixture<ChatMessageCreationDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatMessageCreationDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(ChatMessageCreationDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
