export interface ISubscriptionPlan {
  id: number;
  name: string;
  constraints: IConstraint[];
}

export interface IConstraint {
  id: number;
  key: string;
  defaultValue: number;
}
