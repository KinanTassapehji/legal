import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddApplicationComponent } from './add-application/add-application.component';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent {
  constructor(private matDialog:MatDialog){}
  openDialog(){
    this.matDialog.open(AddApplicationComponent,{
      width: "800px"
    })
  }
}
