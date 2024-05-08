import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
isLoading = true;

ngOnInit(): void{
  setTimeout(() => {
    this.isLoading = false;
  }, 2000);
}
}
