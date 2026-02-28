import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinMaxSlider } from './min-max-slider';

describe('MinMaxSlider', () => {
  let component: MinMaxSlider;
  let fixture: ComponentFixture<MinMaxSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinMaxSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinMaxSlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
