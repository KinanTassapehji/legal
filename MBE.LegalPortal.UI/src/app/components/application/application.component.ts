import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddApplicationComponent } from './add-application/add-application.component';
import { Subscription } from 'rxjs';
import { IApplication } from "../../interfaces/application";
import { ApplicationService } from "../../services/application.service";
import { IApplicationInstance } from '../../interfaces/application-instance';
import { AddApplicationInstanceComponent } from './add-application-instance/add-application-instance.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ApplicationInstanceOverviewComponent } from './application-instance-overview/application-instance-overview.component';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationPopupComponent } from '../../shared/popups/confirmation-popup/confirmation-popup.component';
import { MatPaginator } from '@angular/material/paginator';
import { ApplicationInstanceService } from '../../services/application-instance.service';
import { Utils } from '../../utilities/sort.util';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  applications: IApplication[] = [];
  selectedApplication: IApplication | undefined;
  defaultApplication: IApplication | undefined;
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

  displayedColumns: string[] = ['account', 'name', 'tenants', 'createdOn', 'action'];


  ELEMENT_DATA: IApplicationInstance[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  constructor(private matDialog: MatDialog, private applicationService: ApplicationService, private applicationInstanceService: ApplicationInstanceService, private bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    this.getApplications();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getApplications() {
    this.sub = this.applicationService.getApplications().subscribe({
      next: applications => {
        this.applications = applications;

        // Check if there are applications
        if (this.applications.length > 0) {
          // Set the first application as selected
          this.selectedApplication = applications[0];
          this.defaultApplication = applications[0];
          this.applications[0].selected = true;
          this.applications[0].isDefault = true;
          this.getApplicationInstances(this.applications[0].id);
        }
      },
      error: err => this.errorMessage = err
    });
  }

  sortApplicationInstances(sort: Sort) {
    this.sortDirection = sort?.direction?.toString();
    this.orderBy = sort?.active;

    if (!sort.active || sort.direction === '') {
      return;
    }

    this.getApplicationInstances(this.selectedApplication ? this.selectedApplication.id : 0, sort);
  }

  searchApplicationInstances(keyword: string) {
    this.keyword = keyword;

    const sort = Utils.getSortObject(this.orderBy, this.sortDirection);

    this.getApplicationInstances(this.selectedApplication ? this.selectedApplication.id : 0, sort, keyword);
  }

  getApplicationInstances(id: number, sort?: Sort, keyword?: string) {
    this.applicationInstanceService.getApplicationInstances(id, this.pageIndex + 1, this.pageSize, sort, keyword).subscribe({
      next: response => {
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
    this.getApplicationInstances(this.selectedApplication ? this.selectedApplication.id : 0);
  }

  openAddApplicationDialog() {
    const dialogRef = this.matDialog.open(AddApplicationComponent, {
      width: "800px"
    });

    dialogRef.componentInstance.applicationAdded.subscribe(() => {
      this.getApplications(); // Refresh the list of applications
    });
  }

  openAddApplicationInstanceDialog() {
    const dialogRef = this.matDialog.open(AddApplicationInstanceComponent, {
      width: "800px",
      data: {
        applications: this.applications, // Pass applications data to the dialog component
      }
    });

    dialogRef.componentInstance.applicationInstanceAdded.subscribe(() => {
      if (this.selectedApplication) {
        this.getApplicationInstances(this.selectedApplication.id); // Refresh the list of application instances
      } else {
        console.error("selected Application is undefined");
      }
    });
  }

  openBottomSheet(applicationInstanceId: number): void {
    this.bottomSheet.open(ApplicationInstanceOverviewComponent, {
      panelClass: 'application-overview-bottomsheet-container',
      hasBackdrop: true, // Enable backdrop
      data: { applicationInstanceId: applicationInstanceId }
    });
  }

  onCardClick(id: number) {
    // Loop through all applications
    this.applications.forEach(app => {
      // Set selected to true for the application with the given ID
      app.selected = app.id === id;
    });

    // Find the application with the given ID
    const selectedApp = this.applications.find(app => app.id === id);

    // Set the found application as the selectedApplication
    this.selectedApplication = selectedApp;

    this.getApplicationInstances(id);
  }

  setApplicationAsDefault(id: number) {
    // Loop through all applications
    this.applications.forEach(app => {
      // Set isDefault to true for the application with the given ID
      app.isDefault = app.id === id;
    });

    // Find the application with the given ID
    const defaultApp = this.applications.find(app => app.id === id);

    // Set the found application as the defaultApplication
    this.defaultApplication = defaultApp;
  }

  openDeleteApplicationDialog(id: number) {
    const dialogRef = this.matDialog.open(ConfirmationPopupComponent, {
      width: "400px",
      data: `"${this.applications.find(app => app.id === id)?.name}" Application`,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteApplication(id);
      }
    });
  }

  deleteApplication(id: number) {
    // Call the delete service
    this.applicationService.deleteApplication(id).subscribe({
      next: () => {
        // Update the UI
        this.getApplications();
      },
      error: err => this.errorMessage = err
    });
  }

  openDeleteApplicationInstanceDialog(id: number) {
    const dialogRef = this.matDialog.open(ConfirmationPopupComponent, {
      width: "400px",
      data: `"${this.ELEMENT_DATA.find(app => app.id === id)?.name}" Application Instance`,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteApplicationInstance(id);
      }
    });
  }

  deleteApplicationInstance(id: number) {
    // Call the delete service
    this.applicationInstanceService.deleteApplicationInstance(id).subscribe({
      next: () => {
        // Update the UI
        this.getApplications();
      },
      error: err => this.errorMessage = err
    });
  }
}
