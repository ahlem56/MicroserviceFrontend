import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageEditDriverInterfaceComponent } from './chat-message-edit.component';

describe('ChatMessageEditComponent', () => {
  let component: ChatMessageEditDriverInterfaceComponent;
  let fixture: ComponentFixture<ChatMessageEditDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatMessageEditDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(ChatMessageEditDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
