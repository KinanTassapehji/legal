import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import {
  License_Url,
  Applications_Url,
  Accounts_Url,
  Application_Instances_Url,
  SubscriptionPlans_Url,
} from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { ILicense } from '../interfaces/license';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getLicenseByTenantId(id: number): Observable<ILicense> {
    return this.http.get<any>(`${License_Url}/ByTenantId/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }
  createLicense(data: any): Observable<any> {
    return this.http.post(License_Url, data).pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
  getLicense(page: number, pageSize: number, sort?: Sort, keyword?: string): Observable<any> {
    // Constructing query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (sort?.direction !== undefined && sort?.direction !== '') {
      const direction = sort.direction === 'asc' ? 'Asc' : 'Desc';
      params = params.set('sortDirection', direction);
    }

    if (sort?.active !== undefined) {
      params = params.set('orderBy', sort.active);
    }

    if (keyword !== undefined && keyword.trim() !== '') {
      params = params.set('keyword', keyword.trim());
    }
    return this.http.get<any>(`${License_Url}`, { params })
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
  getApplications(): Observable<any> {
    return this.http.get<any>(`${Applications_Url}`)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
  getAccounts(): Observable<any> {
    return this.http.get<any>(`${Accounts_Url}`)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
  getSubscriptionPlans(): Observable<any> {
    return this.http.get<any>(`${SubscriptionPlans_Url}`)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
  getApplicationInstance(accountId: number, applicationId: number): Observable<any> {
    return this.http.get<any>(`${Application_Instances_Url}?ApplicationId=${applicationId}&AccountId=${accountId}`)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
  getApplicationConstraints(SubscriptionPlanId: number): Observable<any> {
    return this.http.get<any>(`${SubscriptionPlans_Url}/${SubscriptionPlanId}`)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
}
