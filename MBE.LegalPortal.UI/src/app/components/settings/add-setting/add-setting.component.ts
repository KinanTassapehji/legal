import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { SettingService } from '../../../services/setting.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-settings',
  templateUrl: './add-setting.component.html',
  styleUrl: './add-setting.component.scss'
})
export class AddSettingComponent implements OnDestroy {
  @Output() settingsAdded: EventEmitter<void> = new EventEmitter<void>();
  key: string = '';
  value: string = '';
  description: string = '';
  sub!: Subscription;

  constructor(public commonService: CommonService, private settingService: SettingService, private dialogRef: MatDialogRef<AddSettingComponent>) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addSetting(model: any) {
    this.commonService.showAndHideProgressBar(true);
    let requestBody = {
      "Key": model.Key,
      "Value": model.Value,
      "Description": model.Description
    };

    this.sub = this.settingService.createSetting(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.settingsAdded.emit();
        // Close the dialog
        this.dialogRef.close();
        this.commonService.showAndHideProgressBar(false);
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error creating setting', err);
      }
    });
  }
}
