import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingService } from '../../../services/setting.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GetConflictMessage, GetCreateFailedMessage } from '../../../constants/messages-constants';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';

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
  progressBar = false;
  modelName: string = 'Setting';

  constructor(private matDialog: MatDialog, private settingService: SettingService, private dialogRef: MatDialogRef<AddSettingComponent>) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  addSetting(model: any) {
    this.progressBar = true;
    let requestBody = {
      "key": model.key,
      "value": model.value,
      "description": model.description
    };

    this.sub = this.settingService.createSetting(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.settingsAdded.emit();
        // Close the dialog
        this.dialogRef.close();
        this.progressBar = true;
      },
      error: err => {
        let errorMessage = GetCreateFailedMessage(this.modelName);
        if (err.status === 409) {
          // Handle 409 Conflict as a successful response
          errorMessage = GetConflictMessage(this.modelName);
        }
        else {
          // Extract the detailed error message if available
          console.error('Error creating setting', err);
          if (err && err.error && err.error.messages) {
            errorMessage = err.error.messages.join(', ');
          }
        }
        // Display the error message in a dialog
        this.matDialog.open(ErrorPopupComponent, {
          width: '500px',
          disableClose: true, // Prevent closing the dialog by clicking outside
          data: { title: 'Error', message: errorMessage }
        });
        this.progressBar = false;
      }
    });
  }
}
