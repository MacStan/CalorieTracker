import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { of, Observable } from 'rxjs';
import { tap, startWith, map, subscribeOn, filter } from 'rxjs/operators';
import { FoodKindModel } from '../models/food-kind-model';

@Component({
  selector: 'app-add-calorie-track',
  templateUrl: './add-calorie-track.component.html',
  styleUrls: ['./add-calorie-track.component.scss']
})
export class AddCalorieTrackComponent implements OnInit {

  public readonly foodTypeControl = new FormControl('', { validators: Validators.required });
  public readonly weightControl  = new FormControl('', { validators: Validators.min(0) });
  public readonly dateControl = new FormControl(new Date());

  public readonly foodTypeBrandControl = new FormControl('', { validators: Validators.required });
  public readonly foodTypeNameControl = new FormControl('', { validators: Validators.required });
  public readonly foodTypeKcalControl = new FormControl('', { validators: Validators.min(0) });

  myControl = new FormControl();
  options: FoodKindModel[] = [];
  filteredOptions: Observable<FoodKindModel[]>;

  // public foodKinds: Observable<FoodKindModel[]> = of([]);
  constructor(
    private service: DatabaseService
  ) {
    service.getFoodKinds$()
      .pipe(tap(x => this.options = x))
      .subscribe();
  }

  ngOnInit() {
    setTimeout(() => this.service.pingFoodKinds(), 1000);

    this.filteredOptions = this.foodTypeControl.valueChanges.pipe(
      startWith(''),
      tap(x => console.log('Type', x)),
      filter(x => typeof x === 'string'),
      map(value => this.autocompleteFilter(value)),
    );
  }

  public autocompleteFilter(value: string): FoodKindModel[] {
    const filterValue = value.toLowerCase();
    const x =  this.options.filter(option => (option.name + ' - ' + option.brand).toLowerCase().indexOf(filterValue) !== -1);
    console.log('Autocomplete: ', filterValue, this.options, x);
    return x;
  }

  public foodKindModelToString(model: FoodKindModel): string {
    console.log('model');
    console.log(model);
    if (typeof model === 'string'){
      return model;
    }
    return  model.name + ' - ' + model.brand;
  }

  public addFoodTypeToDatabase() {
    if (this.foodTypeNameControl.errors !== null
      || this.foodTypeKcalControl.errors !== null) {
      return;
    }

    if( this.service.foodTypeExists(this.foodTypeBrandControl.value, this.foodTypeNameControl.value) )
    {
      this.foodTypeNameControl.setErrors( {alreadyExists: 'FoodKind with this brand and Name already exists.'});
      // this.foodTypeNameControl.updateValueAndValidity({emitEvent: false});
      return;
    }

    this.service.addFoodType({
      id: Date.now(),
      brand: this.foodTypeBrandControl.value,
      name: this.foodTypeNameControl.value,
      kcalper100Gram: parseFloat(this.foodTypeKcalControl.value)
    });
  }

  public saveToDatabase() {
    console.log(this.weightControl.errors);
    console.log(this.foodTypeControl.errors);

    if (this.foodTypeControl.errors !== null
      || this.weightControl.errors !== null) {
      return;
    }

    const dateOverwrite: Date = this.dateControl.value;
    const date = new Date();
    date.setFullYear(dateOverwrite.getFullYear());
    date.setMonth(dateOverwrite.getMonth());
    date.setDate(dateOverwrite.getDate());

    console.log('savetoDb');
    this.service.addRecord({
      date: date.getTime(),
      foodType: this.foodTypeControl.value,
      weightInGrams: parseFloat(this.weightControl.value),
      kcalTotal: this.foodTypeControl.value.kcalper100Gram / 100 * parseFloat(this.weightControl.value)
    });
  }

}
