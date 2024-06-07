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

  displayedColumns: string[] = ['key', 'appvalue', 'licensevalue', 'policy',];
  ELEMENT_DATA: any[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.loadViolationConstraints();
  }

  loadViolationConstraints() {
      if (this.data) {
          for (var i = 0; i < this.data.length; i++) {
            let action = this.data[i].action;
            let appValue = this.data[i].appValue;
            let licenseValue = this.data[i].licenseValue;
            let tag = action.toString().toLowerCase() === 'noviolation' ? 'no-violation' : action.toString().toLowerCase();
            let list = { key: 'Max Users', appvalue: appValue, licensevalue: licenseValue, policy: '<div class="violation-tag ' + tag + '">' + action + '</div>' };
            this.ELEMENT_DATA.push(list);
          }
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      }
  }
}
