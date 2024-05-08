import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IApplicationInstanceOverview } from '../../../interfaces/application-instance-overview';
import { ApplicationInstanceService } from '../../../services/application-instance.service';
import { Subscription } from 'rxjs';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { LicenseService } from '../../../services/license.service';
import { ILicense } from '../../../interfaces/license';

@Component({
  selector: 'app-application-instance-overview',
  templateUrl: './application-instance-overview.component.html',
  styleUrl: './application-instance-overview.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ApplicationInstanceOverviewComponent implements OnInit, OnDestroy {
  applicationInstance: IApplicationInstanceOverview | undefined;
  license: ILicense | undefined;
  private sub: Subscription | undefined;
  applicationInstanceId: number | undefined;
  selectedTenantId: number | undefined;
  constructor(
    private bottomSheet: MatBottomSheetRef,
    private applicationInstanceService: ApplicationInstanceService,
    private licenseService: LicenseService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any // Inject MAT_BOTTOM_SHEET_DATA
  ) {
    this.applicationInstanceId = data.applicationInstanceId; // Access applicationInstanceId
  }

  dismissAppOverview() {
    this.bottomSheet.dismiss();
  }

  ngOnInit(): void {
    if (this.applicationInstanceId !== undefined) {
      this.getApplicationInstanceById(this.applicationInstanceId);
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getApplicationInstanceById(applicationInstanceId: number) {
    this.sub = this.applicationInstanceService.getApplicationInstanceById(applicationInstanceId).subscribe(
      (response: IApplicationInstanceOverview | undefined) => {
        this.applicationInstance = response;
        if (this.applicationInstance?.tenants && this.applicationInstance.tenants?.length > 0) {
          // Automatically trigger handleTenantClick for the first tenant
          this.handleTenantClick(this.applicationInstance.tenants[0].id);
        }
      },
      (error: any) => {
        console.error('Error retrieving application instance data:', error);
      }
    );
  }

  handleTenantClick(id?: number, event?: Event): void {
    if (event) {
      event.preventDefault(); // Prevent default action of the click event
      event.stopPropagation(); // Stop event propagation
    }
    if (id !== undefined) {
      // Check if the clicked tenant is different from the currently selected one
      if (this.selectedTenantId !== id) {
        this.selectedTenantId = id; // Update the selected tenant
        this.sub = this.licenseService.getLicenseByTenantId(id).subscribe(
          (response: ILicense | undefined) => {
            this.license = response; // Update the license property
          },
          (error: any) => {
            console.error('Error retrieving application instance data:', error);
          }
        );
      }
    }
  }
}
