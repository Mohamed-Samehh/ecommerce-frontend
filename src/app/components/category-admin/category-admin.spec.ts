import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAdmin } from './category-admin';

describe('CategoryAdmin', () => {
  let component: CategoryAdmin;
  let fixture: ComponentFixture<CategoryAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
