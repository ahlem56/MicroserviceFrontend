import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDriverInterfaceComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatDriverInterfaceComponent;
  let fixture: ComponentFixture<ChatDriverInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatDriverInterfaceComponent]
    });
    fixture = TestBed.createComponent(ChatDriverInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
