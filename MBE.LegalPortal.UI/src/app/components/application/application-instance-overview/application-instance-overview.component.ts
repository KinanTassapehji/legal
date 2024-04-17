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

  constructor(
    private bottomSheet: MatBottomSheetRef,
    private applicationInstanceService: ApplicationInstanceService,
    private licenseService: LicenseService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any // Inject MAT_BOTTOM_SHEET_DATA
  )
  {
    this.applicationInstanceId = data.applicationInstanceId; // Access applicationInstanceId
  }

  dismissAppOverview() {
    this.bottomSheet.dismiss();
  }

  ngOnInit(): void {
    if (this.applicationInstanceId !== undefined) {
      this.sub = this.applicationInstanceService.getApplicationInstanceById(this.applicationInstanceId).subscribe(
        (response: IApplicationInstanceOverview | undefined) => {
          this.applicationInstance = response;
        },
        (error: any) => {
          console.error('Error retrieving application instance data:', error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  handleTenantClick(id?: number, event?: MouseEvent): void {
    if (id !== undefined && event) {
      event.preventDefault(); // Prevent the default link behavior
      event.stopPropagation(); // Stop event propagation to parent elements
      this.sub = this.licenseService.getLicenseByTenantId(id).subscribe(
        (response: ILicense | undefined) => {
          this.license = response;
        },
        (error: any) => {
          console.error('Error retrieving application instance data:', error);
        }
      );
    }
  }
}
