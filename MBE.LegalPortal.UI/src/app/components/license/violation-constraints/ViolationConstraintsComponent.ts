import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';



@Component({
    selector: 'app-violation-constraints',
    templateUrl: './violation-constraints.component.html',
    styleUrl: './violation-constraints.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class ViolationConstraintsComponent {

  displayedColumns: string[] = ['keyValue', 'appvalue', 'licensevalue', 'policy',];
  ELEMENT_DATA: any[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    
  }

  ngOnInit(): void {
    this.loadViolationConstraints();
  }

  loadViolationConstraints() {
    this.ELEMENT_DATA = [];
      if (this.data) {
        for (var i = 0; i < this.data.length; i++) {
            let appConstraints =this.data[i].applicationConstraint;
            let action = this.data[i].action;
            let appValue = this.data[i].appValue;
            let licenseValue = this.data[i].licenseValue;
            let keyValue = appConstraints.key;
            let tag = action.toString().toLowerCase() === 'noviolation' ? 'no-violation' : action.toString().toLowerCase();
            let list = { keyValue: keyValue, appvalue: appValue, licensevalue: licenseValue, policy: '<div class="violation-tag ' + tag + '">' + action + '</div>' };
            this.ELEMENT_DATA.push(list);
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      }
  }
}
