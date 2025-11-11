import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCreationBackOfficeComponent } from './rule-creation.component';

describe('RuleCreationComponent', () => {
  let component: RuleCreationBackOfficeComponent;
  let fixture: ComponentFixture<RuleCreationBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleCreationBackOfficeComponent]
    });
    fixture = TestBed.createComponent(RuleCreationBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
