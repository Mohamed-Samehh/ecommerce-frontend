import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuthors } from './admin-authors';

describe('AdminAuthors', () => {
  let component: AdminAuthors;
  let fixture: ComponentFixture<AdminAuthors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAuthors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAuthors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
