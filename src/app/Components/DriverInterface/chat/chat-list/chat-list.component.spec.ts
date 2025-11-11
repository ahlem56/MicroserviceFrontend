import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListDriverInterfaceComponent } from './chat-list.component';

describe('ChatListComponent', () => {
  let component: ChatListDriverInterfaceComponent;
  let fixture: ComponentFixture<ChatListDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatListDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(ChatListDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
