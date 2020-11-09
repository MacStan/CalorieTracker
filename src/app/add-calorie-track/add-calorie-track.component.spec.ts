
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AddCalorieTrackComponent } from './add-calorie-track.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { DatabaseService } from '../services/database.service';
import { FoodKindModel } from '../models/food-kind-model';
import { from } from 'rxjs';

describe('AddCalorieTrackComponent', () => {
  let spectator: Spectator<AddCalorieTrackComponent>;

  const createComponent = createComponentFactory({
    component: AddCalorieTrackComponent,
    imports: [
      BrowserAnimationsModule,
      MatCardModule,
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      MatSelectModule,
      MatTableModule,
      FormsModule,
      ReactiveFormsModule,
      FlexLayoutModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatAutocompleteModule
    ],
    // mocks:[DatabaseService]
    providers: [
      mockProvider(DatabaseService, {
        getFoodKinds$: jasmine.createSpy().and.returnValue(from(generateFoodKinds()))
      })
    ],
    detectChanges: false
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should subscribe to foodKinds$', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.inject(DatabaseService).getFoodKinds$).toHaveBeenCalled();
  });

  function generateFoodKinds(): FoodKindModel[] {
      return [{
        id: 15,
        name: 'name',
        kcalper100Gram: 10,
        brand: 'KFC'
    }];
  }
});
