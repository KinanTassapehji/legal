import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data-template',
  templateUrl: './no-data-template.component.html',
  styleUrl: './no-data-template.component.scss'
})
export class NoDataTemplateComponent {
  @Input() icon: string = 'error_outline';
  @Input() title: string = 'No Data Found';
  @Input() description: string = 'There is no data available to display at this moment.';
}
