import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWrapper } from './test-wrapper';

describe('TestWrapper', () => {
  let component: TestWrapper;
  let fixture: ComponentFixture<TestWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestWrapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
