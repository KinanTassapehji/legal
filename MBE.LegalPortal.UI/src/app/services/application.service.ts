import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { IApplication } from '../interfaces/application';
import { Applications_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { IApplicationInstance } from '../interfaces/application-instance';
import { IApplicationConstraint } from '../interfaces/application-constraint';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getApplications(): Observable<IApplication[]> {
    return this.http.get<IApplication[]>(Applications_Url)
      .pipe(
        map((response: any) => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
    );
  }

  getApplicationInstancesByApplicationId(id: number): Observable<IApplicationInstance[]> {
    return this.http.get<any>(`${Applications_Url}/${id}`)
      .pipe(
        map(response => response.data.applicationInstances),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  getApplicationConstraintsByApplicationId(id: number): Observable<IApplicationConstraint[]> {
    return this.http.get<any>(`${Applications_Url}/${id}`)
      .pipe(
        map(response => response.data.applicationConstraints),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  createApplication(applicationDto: any): Observable<any> {
    return this.http.post(Applications_Url, applicationDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${Applications_Url}/${id}`)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }
}
