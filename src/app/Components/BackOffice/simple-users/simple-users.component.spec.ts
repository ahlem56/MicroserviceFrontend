import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleUsersComponent } from './simple-users.component';

describe('SimpleUsersComponent', () => {
  let component: SimpleUsersComponent;
  let fixture: ComponentFixture<SimpleUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
