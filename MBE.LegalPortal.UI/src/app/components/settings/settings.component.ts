import { Component, ViewChild } from '@angular/core';
import { AddSettingComponent } from './add-setting/add-setting.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { ISetting } from '../../interfaces/setting';
import { SettingService } from '../../services/setting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Utils } from '../../utilities/sort.util';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationPopupComponent } from '../../shared/popups/confirmation-popup/confirmation-popup.component';
import { UpdateSettingComponent } from './update-setting/update-setting.component';
import { SnackbarService } from '../../shared/custom-snackbar/snackbar.service';
import { GetCreateSuccessfullyMessage, GetDeleteFailedMessage, GetDeleteSuccessfullyMessage, GetUpdateSuccessfullyMessage } from '../../constants/messages-constants';
import { MessageType } from '../../enums/messageType';
import { ErrorPopupComponent } from '../../shared/popups/error-popup/error-popup.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  displayedColumns: string[] = ['key', 'value', 'description', 'action'];
  sub!: Subscription;
  settings: ISetting[] = [];
  selectedSettings: ISetting | undefined;
  defaultSettings: ISetting | undefined;
  errorMessage = '';
  modelName: string = 'Setting';
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
  ELEMENT_DATA: ISetting[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  isLoading = true;
  progressBar = false;
  searchActive = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private matDialog: MatDialog, private settingsService: SettingService, private snackbarService: SnackbarService) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getSettings();
  }

  openAddSettingDialog() {
    const dialogRef = this.matDialog.open(AddSettingComponent, {
      width: "600px",
      disableClose: true, // Prevent closing the dialog by clicking outside
    });

    dialogRef.componentInstance.settingsAdded.subscribe(() => {
      this.snackbarService.show(GetCreateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
      this.getSettings(); // Refresh the list of settings
    });
  }

  getSettings(sort?: Sort, keyword?: string) {
    this.sub = this.settingsService.getSettings(this.pageIndex + 1, this.pageSize, sort, keyword).subscribe({
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
    this.getSettings();
  }

  sortSettings(sort: Sort) {
    this.sortDirection = sort?.direction?.toString();
    this.orderBy = sort?.active;
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.getSettings(sort);
  }

  searchSettings(keyword: string) {
    this.keyword = keyword;
    const sort = Utils.getSortObject(this.orderBy, this.sortDirection);
    this.getSettings(sort, keyword);
  }

  openUpdateSettingDialog(element: any) {
    const dialogRef = this.matDialog.open(UpdateSettingComponent, {
      width: "600px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: element,
    });

    dialogRef.componentInstance.settingUpdated.subscribe(() => {
      this.snackbarService.show(GetUpdateSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
      this.getSettings(); // Refresh the list of settings
    });
  }

  openDeleteSettingDialog(id: number) {
    const dialogRef = this.matDialog.open(ConfirmationPopupComponent, {
      width: "400px",
      disableClose: true, // Prevent closing the dialog by clicking outside
      data: `"${this.ELEMENT_DATA.find(app => app.id === id)?.key}" ${this.modelName}`,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSetting(id);
      }
    });
  }

  deleteSetting(id: number) {
    // Call the delete service
    this.settingsService.deleteSetting(id).subscribe({
      next: () => {
        this.snackbarService.show(GetDeleteSuccessfullyMessage(this.modelName), MessageType.SUCCESS);
        // Update the UI
        this.getSettings();
      },
      error: err => {
        // Extract the detailed error message if available
        let errorMessage = GetDeleteFailedMessage(this.modelName);
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
