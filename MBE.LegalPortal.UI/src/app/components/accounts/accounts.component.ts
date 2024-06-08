import { Component, ViewChild } from '@angular/core';
import { AddAccountComponent } from './add-account/add-account.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { IAccount } from '../../interfaces/account';
import { AccountService } from '../../services/account.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Utils } from '../../utilities/sort.util';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationPopupComponent } from '../../shared/popups/confirmation-popup/confirmation-popup.component';
import { UpdateAccountComponent } from './update-account/update-account.component';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../shared/custom-snackbar/snackbar.service';
import { GetCreateSuccessfullyMessage, GetDeleteSuccessfullyMessage, GetUpdateSuccessfullyMessage } from '../../constants/messages-constants';
import { MessageType } from '../../enums/messageType';
import { ErrorPopupComponent } from '../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  displayedColumns: string[] = ['name', 'email', 'phone', 'action'];
  sub!: Subscription;
  accounts: IAccount[] = [];
  selectedAccounts: IAccount | undefined;
  defaultAccounts: IAccount | undefined;
  errorMessage = '';
  modelName: string = 'Account';
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
  ELEMENT_DATA: IAccount[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  isLoading = true;
  searchActive = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private commonService: CommonService, private matDialog: MatDialog, private accountsService: AccountService, private snackbarService: SnackbarService) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAccounts();
  }

  openAddAccountDialog() {
    const dialogRef = this.matDialog.open(AddAccountComponent, {
      width: "600px",
      disableClose: true, // Prevent closing the dialog by clicking outside
});

    dialogRef.componentInstance.accountsAdded.subscribe(() => {
      this.snackbarService.show(GetCreateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
      this.getAccounts(); // Refresh the list of accounts
    });
  }

  getAccounts(sort?: Sort, keyword?: string) {
    this.sub = this.accountsService.getAccounts(this.pageIndex + 1, this.pageSize, sort, keyword).subscribe({
      next: response => {
        this.ELEMENT_DATA = response.data;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        const pi = response; // Paginator Info
        this.totalCount = pi.totalCount;
        this.pageSize = pi.pageSize;
        this.pageIndex = pi.page - 1;
        // Set isLoading to false and emit progress bar state after successful response
        this.isLoading = false;
        if (this.ELEMENT_DATA.length > 0 && !this.searchActive) {
          this.searchActive = true;
        }
      },
      error: err => {
        this.errorMessage = err;
        // Set isLoading to false and emit progress bar state on error
        this.isLoading = false;
      }
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

  openUpdateAccountDialog(element: any) {
    const dialogRef = this.matDialog.open(UpdateAccountComponent, {
      width: "600px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: element,
    });

    dialogRef.componentInstance.accountUpdated.subscribe(() => {
      this.snackbarService.show(GetUpdateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
      this.getAccounts(); // Refresh the list of accounts
    });
  }

  openDeleteAccountDialog(id: number) {
    const dialogRef = this.matDialog.open(ConfirmationPopupComponent, {
      width: "400px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: `"${this.ELEMENT_DATA.find(app => app.id === id)?.name}" ${this.modelName}`,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAccount(id);
      }
    });
  }

  deleteAccount(id: number) {
    // Call the delete service
    this.accountsService.deleteAccount(id).subscribe({
      next: () => {
        this.snackbarService.show(GetDeleteSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
        // Update the UI
        this.getAccounts();
      },
      error: err => {
        // Extract the detailed error message if available
        let errorMessage = GetDeleteSuccessfullyMessage(this.modelName);
        if (err && err.error && err.error.messages) {
          errorMessage = err.error.messages.join(', ');
        }

        // Display the error message in a dialog
        this.matDialog.open(ErrorPopupComponent, {
          width: '500px',
          disableClose: true, // Prevent closing the dialog by clicking outside
          data: { title: 'Error', message: errorMessage }
        });
      }
    });
  }
}
