import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationFrontOfficeComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationFrontOfficeComponent;
  let fixture: ComponentFixture<NotificationFrontOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationFrontOfficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationFrontOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
