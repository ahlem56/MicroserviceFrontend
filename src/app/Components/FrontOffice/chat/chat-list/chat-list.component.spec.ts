import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListFrontOfficeComponent } from './chat-list.component';

describe('ChatListComponent', () => {
  let component: ChatListFrontOfficeComponent;
  let fixture: ComponentFixture<ChatListFrontOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatListFrontOfficeComponent]
    });
    fixture = TestBed.createComponent(ChatListFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
