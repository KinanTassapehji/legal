import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddApplicationComponent } from './add-application/add-application.component';
import { Subscription } from 'rxjs';
import { IApplication } from "../../interfaces/application";
import { ApplicationService } from "../../services/application.service";
import { IApplicationInstance } from '../../interfaces/application-instance';
import { AddApplicationInstanceComponent } from './add-application-instance/add-application-instance.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ApplicationOverviewComponent } from './application-overview/application-overview.component';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  applications: IApplication[] = [];
  selectedApplication: IApplication | undefined;
  errorMessage = '';

  displayedColumns: string[] = ['id', 'account', 'name', 'tenants', 'createdOn'];
  dataSource: IApplicationInstance[] = [];

  constructor(private matDialog: MatDialog, private applicationService: ApplicationService,private bottomSheet: MatBottomSheet) { }

  openBottomSheet(): void {
    this.bottomSheet.open(ApplicationOverviewComponent, {
      panelClass: 'application-overview-bottomsheet-container'
    });
  }
  ngOnInit(): void {
    this.getApplications();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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

    dialogRef.componentInstance.applicationInstanceAdded.subscribe((applicationInstanceId: number) => {
      if (this.selectedApplication) {
        this.getApplicationInstances(this.selectedApplication.id); // Refresh the list of application instances
      } else {
        console.error("selectedApplication is undefined");
      }
    });
  }

  getApplications() {
    this.sub = this.applicationService.getApplications().subscribe({
      next: applications => {
        this.applications = applications;

        // Check if there are applications
        if (this.applications.length > 0) {
          // Set the first application as selected
          this.selectedApplication = applications[0];
          this.applications[0].selected = true;
          this.getApplicationInstances(this.applications[0].id);
        }
      },
      error: err => this.errorMessage = err
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

  setApplicationAsDefault(id: number) {
    // Loop through all applications
    this.applications.forEach(app => {
      // Set selected to true for the application with the given ID
      app.selected = app.id === id;
    });

    // Find the application with the given ID
    const selectedApp = this.applications.find(app => app.id === id);

    // Set the found application as the selectedApplication
    this.selectedApplication = selectedApp;
  }

  onCardClick(id: number) {
    this.getApplicationInstances(id);
  }

  getApplicationInstances(id: number) {
    this.applicationService.getApplicationById(id).subscribe({
      next: instances => {
        this.dataSource = instances;
      },
      error: err => this.errorMessage = err
    });
  }
}
