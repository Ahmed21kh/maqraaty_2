import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet,NavigationStart, Event as NavigationEvent } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTableModule } from 'ng-zorro-antd/table';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    RouterModule,
    BreadcrumbComponent,
    NzBreadCrumbModule,
    NzTableModule,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  routeActive! :any
  event$:any
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    this.event$
    =this.router.events
        .subscribe(
          (event: NavigationEvent) => {
            if(event instanceof NavigationStart) {
              console.log(event.url);
              this.routeActive = event.url;
            }
          });
    console.log(this.routeActive);
    // this.router.navigate(['/registerd'])

  }
  
  ngOnDestroy() {
    this.event$.unsubscribe();
  }
  receiveData(data: any){
    console.log(data);

  }
}
