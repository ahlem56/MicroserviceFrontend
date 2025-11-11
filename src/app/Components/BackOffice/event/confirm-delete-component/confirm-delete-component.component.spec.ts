import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteComponentComponent } from './confirm-delete-component.component';

describe('ConfirmDeleteComponentComponent', () => {
  let component: ConfirmDeleteComponentComponent;
  let fixture: ComponentFixture<ConfirmDeleteComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
