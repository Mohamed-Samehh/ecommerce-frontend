import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagenation } from './pagenation';

describe('Pagenation', () => {
  let component: Pagenation;
  let fixture: ComponentFixture<Pagenation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagenation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pagenation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
