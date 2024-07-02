import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { SettingService } from '../../../services/setting.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';
import { GetConflictMessage, GetUpdateFailedMessage } from '../../../constants/messages-constants';

@Component({
  selector: 'app-update-setting',
  templateUrl: './update-setting.component.html',
  styleUrl: './update-setting.component.scss'
})
export class UpdateSettingComponent {
  @Output() settingUpdated: EventEmitter<void> = new EventEmitter<void>();
  key: string = '';
  value: string = '';
  description: string = '';
  settingId: number = 0;
  sub!: Subscription;
  progressBar = false;
  modelName: string = 'Setting';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private matDialog: MatDialog, private settingService: SettingService, private dialogRef: MatDialogRef<UpdateSettingComponent>) { }

  ngOnInit(): void {
    this.getSettingDetails(this.data);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getSettingDetails(data: any) {
    if (data) {
      this.key = data.key;
      this.value = data.value;
      this.description = data.description;
      this.settingId = data.id;
    }
  }

  updateSetting(data: any) {
    this.progressBar = true;
    const requestBody = {
      id: this.settingId,
      key: data.key,
      value: data.value,
      description: data.description
    };
    this.sub = this.settingService.updateSetting(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.settingUpdated.emit();
        this.progressBar = false;
        // Close the dialog
        this.dialogRef.close();
      },
      error: err => {
        let errorMessage = GetUpdateFailedMessage(this.modelName);
        if (err.status === 409) {
          // Handle 409 Conflict as a successful response
          errorMessage = GetConflictMessage(this.modelName);
        }
        else {
          // Extract the detailed error message if available
          console.error('Error updating setting', err);
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
