import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
