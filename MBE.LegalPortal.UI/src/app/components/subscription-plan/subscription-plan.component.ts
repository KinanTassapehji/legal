import { Component, OnDestroy, OnInit } from '@angular/core';
import { IConstraint, ISubscriptionPlan } from '../../interfaces/subscription-plan';
import { Subscription } from 'rxjs';
import { SubscriptionPlanService } from "../../services/subscription-plan.service";

@Component({
  selector: 'app-subscription-plan',
  templateUrl: './subscription-plan.component.html',
  styleUrls: ['./subscription-plan.component.scss']
})

export class SubscriptionPlanComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  dataSource: any[] = [];

  sub!: Subscription;
  subscriptionPlans: ISubscriptionPlan[] = [];
  constraints: IConstraint[] = [];
  errorMessage = '';

  constructor(private subscriptionPlanService: SubscriptionPlanService) { }

  ngOnInit(): void {
    this.getSubscriptionPlans();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getSubscriptionPlans() {
    this.sub = this.subscriptionPlanService.getSubscriptionPlans().subscribe({
      next: subscriptionPlans => {
        this.subscriptionPlans = subscriptionPlans;
        this.generateDataSource(); // Generate dataSource and displayedColumns
      },
      error: err => this.errorMessage = err
    });
  }

  generateDataSource(): void {
    this.constraints = this.getConstraints();
    this.displayedColumns = ['Constraints'];
    this.subscriptionPlans.forEach(plan => {
      this.displayedColumns.push(plan.name);
    });
    this.dataSource = this.constraints.map(constraint => {
      const rowData: any = { Constraints: constraint.key };
      this.subscriptionPlans.forEach(plan => {
        rowData[plan.name] = this.getConstraintValue(plan, constraint.key);
      });
      return rowData;
    });
  }

  getConstraints(): IConstraint[] {
    const constraints: IConstraint[] = [];
    this.subscriptionPlans.forEach(plan => {
      plan.constraints.forEach(constraint => {
        const existingConstraint = constraints.find(c => c.key === constraint.key);
        if (!existingConstraint) {
          constraints.push(constraint);
        }
      });
    });
    return constraints;
  }

  getConstraintValue(plan: ISubscriptionPlan, key: string): any {
    const constraint = plan.constraints.find(constraint => constraint.key === key);
    return constraint ? constraint.defaultValue : '-';
  }
}
