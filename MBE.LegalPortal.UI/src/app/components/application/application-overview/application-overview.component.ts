import { Component, ViewEncapsulation } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-application-overview',
  templateUrl: './application-overview.component.html',
  styleUrl: './application-overview.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ApplicationOverviewComponent {
  constructor(private bottomSheet: MatBottomSheetRef){}

  dismissAppOverview(){
    this.bottomSheet.dismiss()
  }
}
