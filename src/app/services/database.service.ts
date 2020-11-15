import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { RecordModel } from '../models/record';
import { DatabaseModel } from '../models/database';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { FoodKindModel } from '../models/food-kind-model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private readonly STORAGE_KEY = 'kcalTracking';

  private foodKindsNameSubject = new Subject<string[]>();
  private foodKindsSubject = new Subject<FoodKindModel[]>();
  private recordsSubject = new BehaviorSubject<RecordModel[]>([]);

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  addRecord(newRecord: RecordModel) {
    const store: DatabaseModel = this.retriveStore();
    store.records.push(newRecord);
    this.saveStore(store);
    this.emitRecords();
  }

  removeRecord(date: number) {
    const store = this.retriveStore();
    store.records = store.records.filter(record => record.date !== date);
    this.saveStore(store);
    this.emitRecords();
  }

  addFoodType(newRecord: FoodKindModel) {
    const store: DatabaseModel = this.retriveStore();
    store.foodKinds.push(newRecord);
    this.saveStore(store);
    this.emitFoodTypes();
  }

  removeFoodType(name: string, kcalRatio: number) {
    const store = this.retriveStore();
    store.foodKinds = store.foodKinds.filter(x => x.name !== name || x.kcalper100Gram !== kcalRatio);
    this.saveStore(store);
    this.emitFoodTypes();
  }

  public foodTypeExists(brand: string, name: string): boolean {
    const store = this.retriveStore();
    const found = store.foodKinds.find(x => x.brand === brand && x.name === name);
    console.log('found', found);
    return found !== undefined;
  }

  private emitFoodTypes() {
    const store = this.retriveStore();
    console.log('store.foodKinds', store.foodKinds);
    this.foodKindsNameSubject.next( store.foodKinds.map(x => x.brand + x.name ) );
    this.foodKindsSubject.next(store.foodKinds);
  }

  public emitRecords() {
    const store = this.retriveStore();
    this.recordsSubject.next(store.records);
  }

  getRecords$(): Observable<RecordModel[]> {
    return this.recordsSubject;
  }

  getFoodTypesNames$(): Observable<string[]> {
    return this.foodKindsNameSubject;
  }

  getFoodKinds$(): Observable<FoodKindModel[]> {
    return this.foodKindsSubject;
  }

  pingFoodKinds() {
    const store = this.retriveStore();
    this.foodKindsSubject.next( store.foodKinds );
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
