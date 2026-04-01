import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEstimate } from './new-estimate';

describe('NewEstimate', () => {
  let component: NewEstimate;
  let fixture: ComponentFixture<NewEstimate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEstimate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEstimate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
