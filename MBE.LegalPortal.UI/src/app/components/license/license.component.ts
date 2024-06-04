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
import { ConfirmationPopupComponent } from '../../shared/popups/confirmation-popup/confirmation-popup.component';
import { UpdateLicenseComponent } from './update-license/update-license.component';
import { CommonService } from '../../services/common.service';
import { SnackbarService } from '../../shared/custom-snackbar/snackbar.service';
import { GetCreateSuccessfullyMessage, GetDeleteSuccessfullyMessage, GetUpdateSuccessfullyMessage } from '../../constants/messages-constants';
import { MessageType } from '../../enums/messageType';
import { ErrorPopupComponent } from '../../shared/popups/error-popup/error-popup.component';

export interface PeriodicElement {
  application: string;
  accountname: string;
  tenant: string;
  subscription: string;
  environment: string;
  violation: string;
  expirydate: string;
  expiryaction: string;
  action: string;
}

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrl: './license.component.scss'
})

export class LicenseComponent {
  @Output() licenseAdded: EventEmitter<void> = new EventEmitter<void>();
  displayedColumns: string[] = ['id', 'application', 'accountname', 'tenant', 'subscription', 'environment', 'violation', 'expirydate', 'action'];
  sub!: Subscription;
  license: ILicense[] = [];
  errorMessage = '';
  modelName: string = 'License';
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
  isLoading = true;
  progressBar = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private commonService: CommonService, private matDialog: MatDialog, private licenseService: LicenseService, private snackbarService: SnackbarService) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getLicense();
    this.commonService.changeEmitted$.subscribe(data => this.progressBar = data);
  }

  onCreateLicenseDialog() {
    const dialogRef = this.matDialog.open(CreateLicenseComponent, {
      width: "600px"
    });

    dialogRef.componentInstance.licenseAdded.subscribe(() => {
      this.snackbarService.show(GetCreateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
      this.getLicense(); // Refresh the list of licenses
    });
  }

  getLicense(sort?: Sort, keyword?: string) {
    this.sub = this.licenseService.getLicense(this.pageIndex + 1, this.pageSize, sort, keyword).subscribe({
      next: response => {
        this.ELEMENT_DATA = response.data;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        const pi = response; // Paginator Info
        this.totalCount = pi.totalCount;
        this.pageSize = pi.pageSize;
        this.pageIndex = pi.page - 1;

        // Set isLoading to false and emit progress bar state after successful response
        this.isLoading = false;
        this.commonService.showAndHideProgressBar(false);
      },
      error: err => {
        this.errorMessage = err;

        // Set isLoading to false and emit progress bar state on error
        this.isLoading = false;
        this.commonService.showAndHideProgressBar(false);
      }
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

  openUpdateLicenseDialog(id: number) {
    const dialogRef = this.matDialog.open(UpdateLicenseComponent, {
      width: "800px",
      data: id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.snackbarService.show(GetUpdateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
      this.getLicense();
    });
  }

  openDeleteLicenseDialog(id: number) {
    const dialogRef = this.matDialog.open(ConfirmationPopupComponent, {
      width: "400px",
      data: `${this.modelName}`,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteLicense(id);
      }
    });
  }

  deleteLicense(id: number) {
    // Call the delete service
    this.licenseService.deleteLicense(id).subscribe({
      next: () => {
        this.snackbarService.show(GetDeleteSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
        // Update the UI
        this.getLicense();
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
          data: { title: 'Error', message: errorMessage }
        });
      }
    });
  }


  downloadOfflineLicense(id: number) {
    this.sub = this.licenseService.getOfflineLicense(id).subscribe({
      next: response => {
        console.log('File', response);
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'MBE.LegalPortal.ECL.dll';
        a.click();
        window.URL.revokeObjectURL(url);
        this.commonService.showAndHideProgressBar(false);
      }
    });
  }
}
