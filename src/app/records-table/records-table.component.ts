import { Component, OnInit } from '@angular/core';
import { RecordModel } from '../models/record';
import { DatabaseService } from '../services/database.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-records-table',
  templateUrl: './records-table.component.html',
  styleUrls: ['./records-table.component.css']
})
export class RecordsTableComponent implements OnInit {

  public readonly displayedColumns: string[] = ['name', 'ratio', 'weight', 'kcal', 'remove'];

  public dataSource: MatTableDataSource<RecordModel> = new MatTableDataSource<RecordModel>();

  public kcalTotal: number = 0;

  public dateControl = new FormControl(new Date());

  constructor(private service: DatabaseService) {
    this.filter();
    this.updateKcalTotal();
   }

  ngOnInit() {
  }

  public removeRecord(name: RecordModel) {
    this.service.removeRecord(name.date);
    this.filter();
  }

  public filter() {
    console.log(this.dateControl.value);
    this.dataSource.data = this.service.getRecords().filter( x => {
      const recordedDay = new Date(x.date);
      const expectedDay: Date = this.dateControl.value;
      return recordedDay.getDate() === expectedDay.getDate()
        && recordedDay.getFullYear() === expectedDay.getFullYear()
        && recordedDay.getMonth() === expectedDay.getMonth();
    });
    this.updateKcalTotal();
  }

  private updateKcalTotal() {
    const reducer = (acc, x) => acc + x;
    if ( this.dataSource.data.length > 0 ) {
      this.kcalTotal = this.dataSource.data.map(x => x.kcalTotal).reduce(reducer);
    }
  }

}
