import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddSettingsComponent } from './add-settings/add-settings.component';
import { CommonImageCropperComponent } from '../../shared/popups/common-image-cropper/common-image-cropper.component';

export interface PeriodicElement {
  key: string;
  value: string;
  description: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {key: 'Sample Key 1', value: 'Sample value 1', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', action:''},
  {key: 'Sample Key 2', value: 'Sample value 2', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', action:''},
  {key: 'Sample Key 3', value: 'Sample value 3', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.', action:''},
];
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  isLoading = true;
  displayedColumns: string[] = ['key', 'value', 'description', 'action'];
  dataSource = ELEMENT_DATA;  
  constructor(private matDialog:MatDialog){}
  addSettings(){
    this.matDialog.open(AddSettingsComponent, {
      width:"600px"
    });
  }  
   // common image crop popup
  //  imageCropPopup(){
  //   this.matDialog.open(CommonImageCropperComponent, {
  //     width:"600px"
  //   });
  // }
  // common image crop popup
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
