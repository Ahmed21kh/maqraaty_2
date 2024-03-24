import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/registerd'},
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'registerd', loadChildren: () => import('./pages/registered-students/registerdStudents.routes').then(m => m.RGISTERD_ROUTES ) },
  { path: 'employees', loadChildren: () => import('./pages/employees/registerdStudents.routes').then(m => m.EMPLOYEE_ROUTES ) },
  { path: 'payments', loadChildren: () => import('./pages/payments/payments.routes').then(m => m.PAYMENTS_ROUTES ) },
  { path: 'attendance', loadChildren: () => import('./pages/attendance/registerdStudents.routes').then(m => m.Attendance_ROUTES ) },
  { path: 'student-account/:id', loadChildren: () => import('./pages/student-payment-details/student-payment-details.routes').then(m => m.STUDENT_PAYMENT_DETAILS ) },
  { path: 'student-subscription', loadChildren: () => import('./pages/subscriptions/stubscriptions.routes').then(m => m.SUBSCRIPTIONS ) },
  { path: 'add-student', loadChildren: () => import('./pages/add-student/add-student.routes').then(m => m.ADD_STUDENT ) },
  { path: 'edit-student/:id', loadChildren: () => import('./pages/add-student/add-student.routes').then(m => m.ADD_STUDENT ) },
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.routes').then(m => m.REPORTS_ROUTES ) },
];
