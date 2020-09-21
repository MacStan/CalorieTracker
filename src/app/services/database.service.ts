import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { RecordModel } from '../models/record';
import { DatabaseModel } from '../models/database';
import { Observable, Subject } from 'rxjs';
import { FoodKindModel } from '../models/food-kind-model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private readonly STORAGE_KEY = 'kcalTracking';

  private foodKindsNameSubject = new Subject<string[]>();
  private foodKindsSubject = new Subject<FoodKindModel[]>();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  addRecord(newRecord: RecordModel) {
    const store: DatabaseModel = this.retriveStore();
    store.records.push(newRecord);
    this.saveStore(store);
  }

  removeRecord(date: number) {
    const store = this.retriveStore();
    store.records = store.records.filter(record => record.date !== date);
    this.saveStore(store);
  }

  addFoodType(newRecord: FoodKindModel) {
    const store: DatabaseModel = this.retriveStore();
    store.foodKinds.push(newRecord);
    this.foodKindsNameSubject.next( store.foodKinds.map(x => x.name) );
    this.foodKindsSubject.next(store.foodKinds);
    this.saveStore(store);
  }

  removeFoodType(name: string, kcalRatio: number) {
    const store = this.retriveStore();
    store.foodKinds = store.foodKinds.filter(x => x.name !== name || x.kcalper100Gram !== kcalRatio);
    this.foodKindsNameSubject.next( store.foodKinds.map(x => x.name) );
    this.foodKindsSubject.next(store.foodKinds);
    this.saveStore(store);
  }

  getFoodTypesNames$(): Observable<string[]> {
    return this.foodKindsNameSubject;
  }

  getFoodKinds$(): Observable<FoodKindModel[]> {
    return this.foodKindsSubject;
  }

  pingFoodKindsNames() {
    const store = this.retriveStore();
    this.foodKindsNameSubject.next( store.foodKinds.map(x => x.name) );
  }

  pingFoodKinds() {
    const store = this.retriveStore();
    this.foodKindsSubject.next( store.foodKinds );
  }

  getFoodKinds(): FoodKindModel[] {
    return this.retriveStore().foodKinds;
  }

  getRecords(): RecordModel[] {
    return this.retriveStore().records;
  }

  getDatabase(): DatabaseModel {
    return this.retriveStore();
  }

  private retriveStore(): DatabaseModel {
    return this.storage.get(this.STORAGE_KEY) || new DatabaseModel();
  }

  private saveStore(newStore: DatabaseModel) {
    this.storage.set(this.STORAGE_KEY, newStore);
  }
}
