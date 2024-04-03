import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { ISubscriptionPlan } from '../interfaces/subscription-plan';
import { SubscriptionPlans_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';

@Injectable({
  providedIn: 'root'
})

export class SubscriptionPlanService {
  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getSubscriptionPlans(): Observable<ISubscriptionPlan[]> {
    return this.http.get<ISubscriptionPlan[]>(SubscriptionPlans_Url)
      .pipe(
        map((response: any) => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }
}
