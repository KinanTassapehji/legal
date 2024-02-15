import { Component } from '@angular/core';

export interface PeriodicElement {  
  constraintTitle: string;
  silver: string;
  gold: string;
  platinum: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {constraintTitle: 'Number of Users', silver: '1-5 People', gold: '1-20 People', platinum: 'Unlimited'},
  {constraintTitle: 'Number of Instances', silver: '1', gold: '10', platinum: 'Unlimited'},
  {constraintTitle: 'Number of  Tenants', silver: 'Single', gold: 'Multi', platinum: 'Multi'},
  {constraintTitle: 'Time Control', silver: 'Controlled', gold: 'Uncontrolled', platinum: 'Uncontrolled'},
  {constraintTitle: 'Count Control', silver: 'Controlled', gold: 'Uncontrolled', platinum: 'Uncontrolled'},
];
@Component({
  selector: 'app-subscription-table',
  templateUrl: './subscription-table.component.html',
  styleUrl: './subscription-table.component.scss'
})


export class SubscriptionTableComponent {
  displayedColumns: string[] = ['constraintTitle', 'silver', 'gold', 'platinum'];
  dataSource = ELEMENT_DATA;
}
