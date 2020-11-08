import { Component, OnInit } from '@angular/core';
import { RecordModel } from '../models/record';
import { DatabaseService } from '../services/database.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-records-table',
  templateUrl: './records-table.component.html',
  styleUrls: ['./records-table.component.scss']
})
export class RecordsTableComponent implements OnInit {

  public readonly displayedColumns: string[] = ['name', 'ratio', 'weight', 'kcal', 'remove'];

  public dataSource: MatTableDataSource<RecordModel> = new MatTableDataSource<RecordModel>();

  public kcalTotal: number = 0;

  public dateControl = new FormControl(new Date());

  public recordsActionSubject$ = new BehaviorSubject<any>(null);

  constructor(private service: DatabaseService) {
    // this.filter();
    // this.updateKcalTotal();
    const recordsSubject = service.getRecords$().pipe(
      tap(x => console.log('TTT')),
      tap(x => console.log(x)));

    const recordsActionSubject = this.recordsActionSubject$.asObservable().pipe(
      tap(x => console.log('Dupa')));

    combineLatest([recordsActionSubject, recordsSubject]).pipe(
      map( x => this.filterRecords(x[1])),
      tap(x => this.dataSource.data = x)
    ).subscribe(x => console.log(x));

    service.emitRecords();
   }

  ngOnInit() {
  }

  public removeRecord(name: RecordModel) {
    this.service.removeRecord(name.date);
    this.recordsActionSubject$.next('');
  }

  public clickLeft() {
    const date: Date = this.dateControl.value;
    date.setDate(date.getDate() - 1);
    this.dateControl.setValue(date);
    this.recordsActionSubject$.next('');
  }

  public clickRight() {
    const date: Date = this.dateControl.value;
    date.setDate(date.getDate() + 1);
    this.dateControl.setValue(date);
    this.recordsActionSubject$.next('');
  }

  public filterRecords(records: RecordModel[]): RecordModel[] {
    const expectedDay: Date = this.dateControl.value;
    console.log('filter Records');
    console.log(records);
    const filteredRecords = records.filter( x => {
      const recordedDay = new Date(x.date);
      return recordedDay.getDate() === expectedDay.getDate()
        && recordedDay.getFullYear() === expectedDay.getFullYear()
        && recordedDay.getMonth() === expectedDay.getMonth();
    });
    this.updateKcalTotal(filteredRecords);
    console.log(filteredRecords);
    return filteredRecords;
  }

  // public filter() {
  //   console.log(this.dateControl.value);
  //   this.dataSource.data = this.service.getRecords().filter( x => {
  //     const recordedDay = new Date(x.date);
  //     const expectedDay: Date = this.dateControl.value;
  //     return recordedDay.getDate() === expectedDay.getDate()
  //       && recordedDay.getFullYear() === expectedDay.getFullYear()
  //       && recordedDay.getMonth() === expectedDay.getMonth();
  //   });
  //   this.updateKcalTotal();
  // }

  private updateKcalTotal(records: RecordModel[]): void {
    const reducer = (acc, x) => acc + x;
    if ( records.length > 0 ) {
      this.kcalTotal = records.map(x => x.kcalTotal).reduce(reducer);
    }
    else {
      this.kcalTotal = 0;
    }
  }

}
