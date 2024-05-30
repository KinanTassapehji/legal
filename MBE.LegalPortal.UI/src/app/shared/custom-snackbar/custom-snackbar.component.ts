import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrl: './custom-snackbar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CustomSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string, type: string }) { }

  getIcon() {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'report';
      case 'warning':
        return 'emergency_home';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }

  getClass() {
    return {
      'snackbar-success': this.data.type === 'success',
      'snackbar-error': this.data.type === 'error',
      'snackbar-warning': this.data.type === 'warning',
      'snackbar-info': this.data.type === 'info'
    };
  }
}
