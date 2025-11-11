import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageEditFrontOfficeComponent } from './chat-message-edit.component';

describe('ChatMessageEditComponent', () => {
  let component: ChatMessageEditFrontOfficeComponent;
  let fixture: ComponentFixture<ChatMessageEditFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatMessageEditFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ChatMessageEditFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
