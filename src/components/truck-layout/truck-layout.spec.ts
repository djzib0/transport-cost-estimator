import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckLayout } from './truck-layout';

describe('TruckLayout', () => {
  let component: TruckLayout;
  let fixture: ComponentFixture<TruckLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
