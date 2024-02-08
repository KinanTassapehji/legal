import { Component, ViewEncapsulation } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent {
  ngAfterViewInit() {
    feather.replace();
  }
}
