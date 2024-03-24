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
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { environment } from '../../../environments/environment.development';
interface StudentItem {
  _id: string;
  code: number;
  name: string;
  image: string;
  phone_1: string[];
  phone_2: string[];
  phone_3: string[];
  age: number;
  study_year: string;
  has_relative: string;
  relative: string[];
  is_payment: string;
  is_Azhar: string;
  landline: string;
  address: string;
  notes: string;
  date: Date;
  amount: number;
}
interface DataItem {
  _id: string;
  attend_days_month: [];
  student: string;
  status: string;
  date: string;
  studentDetails: StudentItem;
}
interface DatesObject {
  day: string;
  date: string;
  status: string;
}
interface Student_Names {
  _id: string;
  name: string;
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
  selector: 'app-attendance',
  standalone: true,
  host: { ngSkipHydration: 'true' },
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
    NzToolTipModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent {
  isVisible = false;
  isEdit = false;
  searchName: string = '';
  searchPhone: string = '';
  searchCode: string = '';
  studentId = '';
  attendanceId: string = '';
  isDeleteModal = false;
  listOfData: DataItem[] = [];
  attendanceDate: string = new Date().toLocaleDateString();
  url: string = environment.apiUrl;
  listOfColumns: ColumnItem[] = [
    {
      name: 'الكود',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a._id.localeCompare(b._id),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: (list: string[], item: DataItem) =>
        list.some((name) => item._id.indexOf(name) !== -1),
    },
    {
      name: 'الاسم',
      sortOrder: null,
      sortFn: null,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: null,
    },
    {
      name: 'التاريخ',
      sortOrder: null,
      sortFn: null,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: null,
    },
    {
      name: 'الصورة',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
      filterMultiple: false,
      listOfFilter: [],
      filterFn: null,
    },
    {
      name: 'حالة الحضور',
      sortOrder: null,
      sortFn: null,
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: null,
    },
  ];
  pageSize: number = 5;
  pageNumber: number = 1;
  count!: number;
  total!: number;
  totalPages!: number;
  loadingAdd: boolean = false;
  loadingAEdit: boolean = false;
  loadingSearch: boolean = false;
  loadingData: boolean = false;
  students_Name: Student_Names[] = [];
  student_Data!: StudentItem;
  showStudent: boolean = false;
  nameContent!: string;
  dateFilter!: string;
  editModal: boolean = false;
  dateAttendance: Date = new Date();
  attendanceStatus!: string;
  dataOfDays!: DatesObject[];
  absence: number = 0;
  dataOfAllDates!:DatesObject[]

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private appService: AappServiceService
  ) {}

  // myForm = this.fb.group({
  //   name: ['', [Validators.required, Validators.minLength(4)]],
  //   phone_1: this.fb.array([
  //    new FormControl('',[Validators.min(10),Validators.pattern(/^\d{10}$/),Validators.required])
  //   ]),
  //   phone_2: this.fb.array([
  //        new FormControl('',[Validators.min(10),Validators.pattern(/^\d{10}$/),Validators.required])
  //   ]),
  //   phone_3: this.fb.array([
  //        new FormControl('',[Validators.min(10),Validators.pattern(/^\d{10}$/),Validators.required])
  //   ]),
  //   age:[0,Validators.required],
  //   study_year:['',Validators.required],
  //   has_relative:['',Validators.required],
  //   relative:this.fb.array([
  //     new FormControl('',[Validators.required,Validators.minLength(4)])
  //   ]),
  //   is_payment:['',Validators.required],
  //   is_Azhar:['',Validators.required],
  //   landline: ['', [Validators.required, Validators.min(7)]],
  //   address: ['', Validators.required],
  //   date:[new Date() ,Validators.required],
  //   image: [''],
  //   notes: [''],
  // });

  paymentForm = this.fb.group({
    amount: [0, Validators.required],
    date: [new Date(), Validators.required],
  });

  // get arr_phone_1() {
  //   return this.myForm.get('phone_1') as FormArray;
  // }
  // get arr_phone_2() {
  //   return this.myForm.get('phone_2') as FormArray;
  // }
  // get arr_phone_3() {
  //   return this.myForm.get('phone_3') as FormArray;
  // }
  // get arr_relative() {
  //   return this.myForm.get('relative') as FormArray;
  // }
  // get f() {
  //   return this.myForm.controls;
  // }
  get pf() {
    return this.paymentForm.controls;
  }
  changeAttendanceDate(e: Date) {
    console.log(e.getMonth());
    this.dataOfDays = this.dataOfAllDates.filter((a:DatesObject)=>new Date(a.date).getMonth() == e.getMonth())
    this.absence = this.dataOfAllDates.filter((d: any) => d.status === 'غائب')?.length;
  }
  handleCompareDate(date: any) {
    console.log(new Date(date).toLocaleDateString());
    console.log(this.dateAttendance.toLocaleDateString());

    console.log(
      new Date(date).toLocaleDateString() ==
        this.dateAttendance.toLocaleDateString()
    );

    return (
      new Date(date).toLocaleDateString() ==
      this.dateAttendance.toLocaleDateString()
    );
  }
  changeStatusOfAttendance(e: any, data: any) {
    console.log(data);
    console.log(e);
    console.log(new Date().toISOString());
    let date = new Date();
    this.dateAttendance.setHours(0, 0, 0, 0);
    console.log(date);

    this.appService
      .getDatesAndDays()
      ?.map((d: any) =>
        console.log(
          new Date(d.date).toISOString() == this.dateAttendance.toISOString()
        )
      );
    let days = this.appService.getDatesAndDays();
    if (
      data?.attend_days_month?.some(
        (e: any) => new Date(e.date).getMonth() == new Date().getMonth()
      )
    ) {
      this.dataOfDays = data?.attend_days_month;
    } else {
      this.dataOfDays = [...data?.attend_days_month, ...days];
    }

    let newDates = this.dataOfDays?.map((d: any) =>
      new Date(d.date).toISOString() == this.dateAttendance.toISOString()
        ? { ...d, date: new Date(d.date), status: e }
        : { ...d, date: new Date(d.date) }
    );
    console.log(newDates);

    this.appService
      .updateAttendance(data?._id, {
        attend_days_month: newDates,
        date: this.dateAttendance.toLocaleDateString(),
        status: e,
      })
      .subscribe({
        next: (res) => {
          this.msg.success('Attendance updated success');
          this.getDataOfAttendance();
        },
        error: (err) => this.msg.error(err.message),
      });
  }
  openShowStudent(data: StudentItem) {
    this.student_Data = data;
    this.showStudent = true;
  }

  closeShowStudent() {
    this.showStudent = false;
  }
  studentName(id: string) {
    let student = this.students_Name.filter((data) => data._id == id)[0]?.name;
    return student;
  }
  getNameOfOneStudent(id: string) {
    let student = this.students_Name.filter((data) => data._id == id)[0].name;
    return student;
  }

  resetData() {
    this.paymentForm.reset({
      amount: 0,
      date: new Date(),
    });
    this.attendanceId = '';
    this.absence = 0;
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
    if (result !== null) {
      this.dateFilter = result.toISOString();
      this.getDataOfAttendance();
    } else {
      this.dateFilter = '';
      this.getDataOfAttendance();
    }
  }
  async getDataOfAttendance() {
    this.loadingData = true;
    this.appService
      .getAttendanceData(this.pageNumber, this.pageSize, this.dateFilter)
      .subscribe({
        next: async (data) => {
          // console.log(data);
          this.listOfData = await data.data;
          this.count = await data?.metaData?.count;
          this.totalPages = await data?.metaData?.totalPages;
          this.total = await data?.metaData?.total;

          this.loadingData = false;
        },
        error: (err) => {
          console.log(err);
          this.msg.error(err.message);
        },
      });
  }

  async getStudentsName() {
    // this.appService.getStudents_names().subscribe({
    //   next:async(data)=>{
    //     this.students_Name = await data;
    //   },
    //   error:(err)=>{
    //     this.msg.error(err.message)
    //   }
    // })
  }

  // async getOneUser(Id:string){
  //   this.appService.getOne_student(Id).subscribe({
  //     next:async(data)=>{
  //       this.student_Data = await data;
  //     },
  //     error:(err)=>{
  //       this.msg.error(err.message)
  //     }
  //   })
  // }
  handleOpenConfirmDelete(id: any): void {
    this.attendanceId = id;
    this.isDeleteModal = true;
  }

  handleCancelConfirmDelete(): void {
    this.isDeleteModal = false;
  }

  handleDelete() {
    this.isDeleteModal = false;
    this.appService
      .deleteAttendance(this.attendanceId)
      .pipe(
        map(() => {
          // this.msg.loading("loading...")
        })
      )
      .subscribe({
        next: (response) => {
          this.msg.success('تم الحذف بنجاح');
          this.getDataOfAttendance().then(() => {
            this.isDeleteModal = false;
          });
        },
        error: (err) => {
          this.msg.error(err.message);
        },
      });
  }

  ngOnInit(): void {
    this.getDataOfAttendance();
    this.getStudentsName();
  }
  changePagination(e: any) {
    console.log(e);
    this.pageNumber = e;
    this.getDataOfAttendance();
  }
  showModal(): void {
    this.isVisible = true;
    this.isEdit = false;
  }

  dataOfDatesArr() {
    console.log(
      'Dates Data =>>>>>>',
      this.dataOfDays.filter(
        (a: DatesObject) =>
          new Date(a.date).getMonth() == this.dateAttendance.getMonth()
      )
    );
    let data = this.dataOfDays.filter(
      (a: DatesObject) =>
        new Date(a.date).getMonth() == this.dateAttendance.getMonth()
    );
    return data;
  }

  showEditModal(id: string, sId: string, data: any) {
    this.attendanceId = id;
    this.studentId = sId;
    this.editModal = true;
    this.absence = data.filter((d: any) => d.status === 'غائب')?.length;
    let days = this.appService.getDatesAndDays();
    console.log(new Date().getMonth() + 1);
    console.log(
      data.some(
        (e: any) => new Date(e.date).getMonth() == new Date().getMonth()
      )
    );

    data.map((e: any) => console.log(new Date(e.date).getMonth()));

    if (
      data.some(
        (e: any) => new Date(e.date).getMonth() == new Date().getMonth()
      )
    ) {
      this.dataOfDays = data;
      this.dataOfAllDates = data

    } else {
      this.dataOfDays = [...data, ...days];
      this.dataOfAllDates = [...data, ...days];
    }
  }
  cancelEditModal() {
    this.editModal = false;
    this.resetData();
  }
  handleDeleteAttendance() {}

  updatePayment() {
    this.appService
      .updatePayment(this.attendanceId, {
        ...this.paymentForm,
        student: this.studentId,
      })
      .subscribe({
        next: async (data) => {
          this.getDataOfAttendance().then((data) => {
            this.msg.success('payment updated successfully');
            this.editModal = false;
            this.resetData();
          });
        },
        error: (err) => {
          this.msg.error(err.message);
        },
      });
  }

  validate() {
    this.paymentForm.controls.amount.markAllAsTouched();
    this.paymentForm.controls.date.markAllAsTouched();
  }
}
