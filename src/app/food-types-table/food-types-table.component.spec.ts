import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodTypesTableComponent } from './food-types-table.component';

describe('FoodTypesTableComponent', () => {
  let component: FoodTypesTableComponent;
  let fixture: ComponentFixture<FoodTypesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodTypesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
