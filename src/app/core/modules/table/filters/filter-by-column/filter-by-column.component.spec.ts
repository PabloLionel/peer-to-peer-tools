import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterByColumnComponent } from './filter-by-column.component';

describe('FilterByColumnComponent', () => {
  let component: FilterByColumnComponent;
  let fixture: ComponentFixture<FilterByColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterByColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterByColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
