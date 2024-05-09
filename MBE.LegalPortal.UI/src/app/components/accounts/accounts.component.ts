import { Component } from '@angular/core';
import { AddAccountComponent } from './add-account/add-account.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { IAccount } from '../../interfaces/account';
import { AccountService } from '../../services/account.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { Utils } from '../../utilities/sort.util';

export interface PeriodicElement {
  accountname: string;
  email: string;
  phone: string;
  applicationinstance: number;
  action: string;
}



@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  displayedColumns: string[] = ['accountname', 'email', 'phone', 'applicationinstance', 'action'];
  sub!: Subscription;
  accounts: IAccount[] = [];
  selectedAccounts: IAccount | undefined;
  defaultAccounts: IAccount | undefined;
  errorMessage = '';
  // Paginator
  totalCount = 0;
  pageSize = 5;
  pageIndex = 0;
  // Sort
  sortDirection?= '';
  orderBy?= '';
  // Search
  keyword?= '';
  ELEMENT_DATA: IAccount[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  isLoading = true;
  constructor(private matDialog: MatDialog, private accountsService: AccountService) { }
  ngOnInit(): void {
    this.getAccounts();
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  addAccount(){
    this.matDialog.open(AddAccountComponent, {
      width:"600px"
    });
  }

  //
  getAccounts(sort?: Sort, keyword?: string) {
    this.sub = this.accountsService.getAccounts(this.pageIndex + 1, this.pageSize, sort, keyword).subscribe({
      next: response => {
        console.log('response', response);
        this.ELEMENT_DATA = response.data;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        const pi = response; // Paginator Info
        this.totalCount = pi.totalCount;
        this.pageSize = pi.pageSize;
        this.pageIndex = pi.page - 1;
      },
      error: err => this.errorMessage = err
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAccounts();
  }

  sortAccounts(sort: Sort) {
    this.sortDirection = sort?.direction?.toString();
    this.orderBy = sort?.active;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.getAccounts(sort);
  }

  searchAccounts(keyword: string) {
    this.keyword = keyword;
    const sort = Utils.getSortObject(this.orderBy, this.sortDirection);
    this.getAccounts(sort, keyword);
  }
}
