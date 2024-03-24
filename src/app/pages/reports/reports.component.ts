import { Component, OnInit } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AappServiceService } from '../../services/aapp-service.service';
import Swal from 'sweetalert2';
import { NzImageModule } from 'ng-zorro-antd/image';
import { map } from 'rxjs';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

interface DataItem {
  _id: string;
  code: number;
  name: string;
  image: string;
  phone_1: string[];
  phone_2: string[];
  phone_3: string[];
  age:number;
  study_year:string,
  has_relative:string;
  relative:string[];
  is_payment:string;
  is_Azhar:string;
  landline: string;
  address: string;
  notes: string;
  date:Date,
  amount:number
}
interface AttendanceItem {
  attend_days_month:any;
  status:string;
  date:string;
}
interface Student_Names {
  _id:string;
  name:string;
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<DataItem> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<DataItem> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    NzGridModule,
    BreadcrumbComponent,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzImageModule,
    NzPaginationModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzRadioModule,
    NzSelectModule,
    CommonModule,
    NzDividerModule,
    NzStatisticModule,
    NzCardModule,
    NzSkeletonModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
constructor(private appService:AappServiceService,private msg:NzMessageService){

}

date:any = null;
totalAmount:number=0
today:Date = new Date(); // Get today's date
currentYear:number = this.today.getFullYear();
currentMonth:number = this.today.getMonth() + 1; // Adding 1 since months are 0-based
startDate:string =new Date(this.currentYear,this.currentMonth - 1 , 1).toLocaleDateString().split("T")[0]
endDate:string =new Date(this.currentYear,this.currentMonth ,0).toLocaleDateString().split("T")[0]
amountOfAllStudents:number = 0;
loadingData:boolean = false;

ngOnInit(): void {
  this.getAllReports()
console.log("Start Date:", this.startDate);
console.log("End Date:", this.endDate);
this.date = [this.startDate,this.endDate]
}
getAllReports(){
  this.loadingData = true;
  this.appService.getReports(this.startDate,this.endDate).subscribe({next:(res)=>{
  console.log(res);
  if (res?.amountOfAllStudents) {
    this.amountOfAllStudents = res?.amountOfAllStudents
  }
  if (res?.totalAmount) {
    this.totalAmount = res?.totalAmount
  }else {
    this.totalAmount = 0
  }
  this.loadingData = false;
  },error:(e)=>{
  this.msg.error(e.message)
  this.loadingData = false;
  }})
}
getPercent(){
  let val = 100 * (this.totalAmount/this.amountOfAllStudents)
  console.log(val);
  return val ? Math.abs(val).toFixed(0) : 0
}
onChange(result: Date[]): void {
 if (result.length>0){
  console.log('start: ', result[0].toISOString().split('T')[0]);
  console.log('end: ', result[1].toISOString().split('T')[0]);
  this.startDate = result[0].toISOString().split('T')[0]
  this.endDate = result[1].toISOString().split('T')[0]
  this.getAllReports()
} else {
  this.startDate =""
  this.endDate = ""
  this.getAllReports()

}
}

getWeek(result: Date[]): void {
  // console.log('week: ', result.map(getISOWeek));
}
}
