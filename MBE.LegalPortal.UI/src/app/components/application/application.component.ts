import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddApplicationComponent } from './add-application/add-application.component';
import { Subscription } from 'rxjs';
import { IApplication } from "../../interfaces/application";
import { ApplicationService } from "../../services/application.service";
import { IApplicationInstance } from '../../interfaces/application-instance';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  applications: IApplication[] = [];
  errorMessage = '';

  displayedColumns: string[] = ['id', 'account', 'name', 'tenants', 'createdOn'];
  dataSource: IApplicationInstance[] = [];

  constructor(private matDialog: MatDialog, private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.getApplications();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openDialog() {
    this.matDialog.open(AddApplicationComponent, {
      width: "800px"
    });
  }

  getApplications() {
    this.sub = this.applicationService.getApplications().subscribe({
      next: applications => {
        this.applications = applications;

        // Check if there are applications
        if (this.applications.length > 0) {
          // Set the first application as selected
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
  }

  onCardClick(id: number) {
    this.getApplicationInstances(id);
  }

  getApplicationInstances(id: number) {
    this.applicationService.getApplicationById(id)
      .subscribe({
        next: instances => {
          this.dataSource = instances;
        },
        error: err => this.errorMessage = err
      });
  }
}
