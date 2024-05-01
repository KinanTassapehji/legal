import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Application_Instances_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { IApplicationInstanceOverview } from '../interfaces/application-instance-overview';

@Injectable({
  providedIn: 'root'
})
export class ApplicationInstanceService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getApplicationInstances(applicationId: number, page: number, pageSize: number): Observable<any> {
    // Constructing query parameters
    const params = new HttpParams()
      .set('applicationId', applicationId.toString())
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${Application_Instances_Url}`, { params })
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  getApplicationInstanceById(id: number): Observable<IApplicationInstanceOverview> {
    return this.http.get<any>(`${Application_Instances_Url}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  createApplicationInstance(applicationInstanceDto: any): Observable<any> {
    return this.http.post(Application_Instances_Url, applicationInstanceDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
    );
  }
}
