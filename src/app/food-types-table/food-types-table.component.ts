import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DatabaseService } from '../services/database.service';
import { FoodKindModel } from '../models/food-kind-model';
import { saveAs } from 'file-saver';
import { RecordModel } from '../models/record';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-food-types-table',
  templateUrl: './food-types-table.component.html',
  styleUrls: ['./food-types-table.component.css']
})
export class FoodTypesTableComponent implements OnInit {

  public readonly filterControl: FormControl = new FormControl();

  public readonly displayedColumns: string[] = ['brand', 'name', 'ratio', 'remove'];

  public dataSource: MatTableDataSource<FoodKindModel> = new MatTableDataSource<FoodKindModel>();
  public foodTypesNames$: Observable<string[]> = of([]);
  public foodTypes$: Observable<FoodKindModel[]> = of([]);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private readonly service: DatabaseService) {
    this.foodTypesNames$ = service.getFoodTypesNames$().pipe(
      tap(x => console.log('get food types names')),
    );
    this.foodTypes$ = service.getFoodKinds$().pipe(
      tap( x => console.log(x) ),
      tap(x => this.dataSource.data = x.map(y => {
        if (y.brand === null) {
          y.brand = 'no brand';
        }
        return y;
      }))
    );
    this.foodTypesNames$.subscribe();
    this.foodTypes$.subscribe();
  }

  ngOnInit() {
    setTimeout(() => this.service.pingFoodKinds(), 1000);
    this.dataSource.sort = this.sort;
  }

  exportData() {
    const blob = new Blob([JSON.stringify(this.service.getDatabase())], { type: 'text/plain' });
    saveAs(blob, 'KcalTrackerData.json');
  }

  removeRecord(model: FoodKindModel) {
    this.service.removeFoodType(model.name, model.kcalper100Gram);
  }

  removeFilter() {
    this.dataSource.filter = null;
  }

  filter() {
    this.dataSource.filter = this.filterControl.value;
  }
}
