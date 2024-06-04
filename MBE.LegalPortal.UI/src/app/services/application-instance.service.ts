import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Application_Instances_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { IApplicationInstance } from '../interfaces/application-instance';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class ApplicationInstanceService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getApplicationInstances(applicationId: number, page: number, pageSize: number, sort?: Sort, keyword?: string): Observable<any> {
    // Constructing query parameters
    let params = new HttpParams()
      .set('applicationId', applicationId.toString())
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

    return this.http.get<any>(`${Application_Instances_Url}`, { params })
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  getApplicationInstanceById(id: number): Observable<IApplicationInstance> {
    return this.http.get<any>(`${Application_Instances_Url}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  getApplicationInstance(accountId: number, applicationId: number): Observable<any> {
    return this.http.get<any>(`${Application_Instances_Url}?ApplicationId=${applicationId}&AccountId=${accountId}`)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  createApplicationInstance(applicationInstanceDto: any): Observable<any> {
    return this.http.post(Application_Instances_Url, applicationInstanceDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  updateApplicationInstance(applicationInstanceDto: any): Observable<any> {
    return this.http.put(`${Application_Instances_Url}/${applicationInstanceDto.id}`, applicationInstanceDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  deleteApplicationInstance(id: number): Observable<void> {
    return this.http.delete<void>(`${Application_Instances_Url}/${id}`);
  }
}
