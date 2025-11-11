import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleDetailsBackOfficeComponent } from './rule-details.component';

describe('RuleDetailsComponent', () => {
  let component: RuleDetailsBackOfficeComponent;
  let fixture: ComponentFixture<RuleDetailsBackOfficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RuleDetailsBackOfficeComponent]
    });
    fixture = TestBed.createComponent(RuleDetailsBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
