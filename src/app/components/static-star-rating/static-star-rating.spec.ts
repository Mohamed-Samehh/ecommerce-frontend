import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticStarRating } from './static-star-rating';

describe('StaticStarRating', () => {
  let component: StaticStarRating;
  let fixture: ComponentFixture<StaticStarRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticStarRating]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticStarRating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
