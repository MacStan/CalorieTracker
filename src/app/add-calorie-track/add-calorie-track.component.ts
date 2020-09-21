import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../services/database.service';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-calorie-track',
  templateUrl: './add-calorie-track.component.html',
  styleUrls: ['./add-calorie-track.component.css']
})
export class AddCalorieTrackComponent implements OnInit {

  private readonly foodTypeControl = new FormControl('ss', { validators: Validators.required });
  private readonly weightControl  = new FormControl('', { validators: Validators.min(0) });

  private readonly foodTypeNameControl = new FormControl('', { validators: Validators.required });
  private readonly foodTypeKcalControl = new FormControl('', { validators: Validators.min(0) });

  public foodTypes: Observable<string[]> = of([]);
  constructor(
    private service: DatabaseService
  ) {
    this.foodTypes = service.getFoodTypesNames$().pipe(tap(x => console.log("addCalorieComponent getfood types name" + x)));
  }

  ngOnInit() {
    setTimeout(() => this.service.pingFoodKindsNames(), 1000);
  }

  public addFoodTypeToDatabase() {
    if (this.foodTypeNameControl.errors !== null
      || this.foodTypeKcalControl.errors !== null) {
      return;
    }

    this.service.addFoodType({
      id: Date.now(),
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

    const foodType = this.service.getFoodKinds().filter(x => x.name === this.foodTypeControl.value)[0];

    console.log('savetoDb');
    this.service.addRecord({
      date: Date.now(),
      foodType,
      weightInGrams: parseFloat(this.weightControl.value),
      kcalTotal: foodType.kcalper100Gram / 100 * parseFloat(this.weightControl.value)
    });
  }

}
