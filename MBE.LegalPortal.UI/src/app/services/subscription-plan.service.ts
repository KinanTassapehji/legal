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

  getSubscriptionPlans(applicationId?: number): Observable<ISubscriptionPlan[]> {
    let url = SubscriptionPlans_Url;
    if (applicationId !== undefined && applicationId !== null) {
      // If applicationId is provided, include it in the URL
      url += `?applicationId=${applicationId}`;
    }

    return this.http.get<ISubscriptionPlan[]>(url)
      .pipe(
        map((response: any) => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  getSubscriptionPlansById(subscriptionPlanId: number): Observable<any> {
    return this.http.get<any>(`${SubscriptionPlans_Url}/${subscriptionPlanId}`)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  createSubscriptionPlan(subscriptionPlanDto: any): Observable<any> {
    return this.http.post(SubscriptionPlans_Url, subscriptionPlanDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  updateSubscriptionPlan(subscriptionPlanDto: any): Observable<any> {
    return this.http.put(`${SubscriptionPlans_Url}/${subscriptionPlanDto.id}`, subscriptionPlanDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  deleteSubscriptionPlan(id?: number): Observable<void> {
    return this.http.delete<void>(`${SubscriptionPlans_Url}/${id}`);
  }
}
