import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
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
  progressBar = false;

  constructor(private settingService: SettingService, private dialogRef: MatDialogRef<AddSettingComponent>) { }

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
      error: (err) => {
        // Handle error response, maybe show an error message
        console.error('Error creating setting', err);
    this.progressBar = true;
      }
    });
  }
}
