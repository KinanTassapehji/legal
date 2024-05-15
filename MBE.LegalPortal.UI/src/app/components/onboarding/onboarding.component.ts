import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class OnboardingComponent {
  isLoading = true;
  // Current selected tab index
  selectedIndex: number = 0;

  // Array to hold tab labels
  tabLabels: string[] = ['Account', 'Application', 'Subscription Plan', 'License'];

  // Method to handle tab change event
  onTabChanged(event: MatTabChangeEvent): void {
    this.selectedIndex = event.index;
  }

  // Method to navigate to the next tab
  nextTab(): void {
    if (this.selectedIndex < this.tabLabels.length - 1) {
      this.selectedIndex++;
    }
  }

  // Method to navigate to the previous tab
  previousTab(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
