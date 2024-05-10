import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CreateLicenseComponent } from './create-license/create-license.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { ILicense } from '../../interfaces/license';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LicenseService } from '../../services/license.service';
import { Utils } from '../../utilities/sort.util';

export interface PeriodicElement {
  application: string;
  accountname: string;
  tenant: string;
  subscription: string;
  environment: string;
  expirydate: string;
  expiryaction: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})
export class LicenseComponent {
  @Output() licenseAdded: EventEmitter<void> = new EventEmitter<void>();
  displayedColumns: string[] = ['application', 'accountname', 'tenant', 'subscription', 'environment', 'expirydate', 'expiryaction', 'action'];
  sub!: Subscription;
  license: ILicense[] = [];
  selectedLicense: ILicense | undefined;
  defaultLicense: ILicense | undefined;
  errorMessage = '';
  // Paginator
  totalCount = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 20];
  // Sort
  sortDirection?= '';
  orderBy?= '';
  // Search
  keyword?= '';
  ELEMENT_DATA: ILicense[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private matDialog: MatDialog, private licenseService: LicenseService) { }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getLicense();
  }
  createLicense(){
    this.matDialog.open(CreateLicenseComponent, {
      width:"600px"
    });
  }

  getLicense(sort?: Sort, keyword?: string) {
    this.sub = this.licenseService.getLicense(this.pageIndex + 1, this.pageSize, sort, keyword).subscribe({
      next: response => {
        for (let i = 0; i < response.data.length; i++) {
          let tenantId = response.data[i].tenant.id;
          this.sub = this.licenseService.getApplicationIntanceId(tenantId).subscribe({
            next: applicationIntanceResponse => {
              let applicationInstanceId = applicationIntanceResponse.data.id;
              this.sub = this.licenseService.getApplicationAndAccount(applicationInstanceId).subscribe({
                next: applicationAccountResponse => {
                  let account = applicationAccountResponse.data.account;
                  let application = applicationAccountResponse.data.application;
                  this.ELEMENT_DATA = response.data;
                  this.ELEMENT_DATA[i].account = account;
                  this.ELEMENT_DATA[i].application = application;
                  this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                  const pi = response; // Paginator Info
                  this.totalCount = pi.totalCount;
                  this.pageSize = pi.pageSize;
                  this.pageIndex = pi.page - 1;
                },
                error: err => this.errorMessage = err //getApplicationAndAccount
              });
            },
            error: err => this.errorMessage = err //getApplicationIntanceId
          });
        }
      },
      error: err => this.errorMessage = err //getLicense
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getLicense();
  }

  sortLicense(sort: Sort) {
    this.sortDirection = sort?.direction?.toString();
    this.orderBy = sort?.active;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.getLicense(sort);
  }

  searchLicense(keyword: string) {
    this.keyword = keyword;
    const sort = Utils.getSortObject(this.orderBy, this.sortDirection);
    this.getLicense(sort, keyword);
  }
  
}
