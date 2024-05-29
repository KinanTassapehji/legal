import { Component, ViewEncapsulation } from '@angular/core';


export interface PeriodicElement {
  key: string;
  appvalue: string;
  licensevalue: string;
  policy: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {key: 'Max Users', appvalue: '50', licensevalue: '40', policy: '<div class="violation-tag silent">Silent</div>',},
  {key: 'Max Devices', appvalue: '20', licensevalue: '15', policy: '<div class="violation-tag default">Default</div>',},
  {key: 'Max Surveys', appvalue: '500', licensevalue: '450', policy: '<div class="violation-tag breach">Breach</div>',},
  {key: 'Max Reports', appvalue: '50', licensevalue: '45', policy: '<div class="violation-tag no-violation">No Violation</div>',},
];

@Component({
  selector: 'app-violation-constraints',
  templateUrl: './violation-constraints.component.html',
  styleUrl: './violation-constraints.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class ViolationConstraintsComponent {
  displayedColumns: string[] = ['key', 'appvalue', 'licensevalue', 'policy',];
  dataSource = ELEMENT_DATA;
}
