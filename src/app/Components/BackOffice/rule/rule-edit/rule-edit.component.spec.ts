import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleEditBackOfficeComponent } from './rule-edit.component';

describe('RuleEditComponent', () => {
  let component: RuleEditBackOfficeComponent;
  let fixture: ComponentFixture<RuleEditBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleEditBackOfficeComponent]
    });
    fixture = TestBed.createComponent(RuleEditBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
