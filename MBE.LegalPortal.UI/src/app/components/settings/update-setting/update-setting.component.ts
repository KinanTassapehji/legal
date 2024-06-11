import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { SettingService } from '../../../services/setting.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private settingService: SettingService, private dialogRef: MatDialogRef<UpdateSettingComponent>) { }

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
      this.value = data.value;
      this.key = data.key;
      this.description = data.description;
      this.settingId = data.id;
    }
  }

  updateSetting(data: any) {
    this.progressBar = true;
    const requestBody = {
      id: this.settingId,
      key: data.Key,
      value: data.Value,
      description: data.Description
    };
    this.sub = this.settingService.updateSetting(requestBody).subscribe({
      next: () => {
        // Emit event to notify parent component
        this.settingUpdated.emit();
        this.progressBar = false;
        // Close the dialog
        this.dialogRef.close();
      },
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error updating setting', err);
        this.progressBar = false;
      }
    });
  }
}
