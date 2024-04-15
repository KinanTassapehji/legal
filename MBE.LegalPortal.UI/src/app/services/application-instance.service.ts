import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Application_Instances_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationInstanceService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  createApplicationInstance(applicationInstanceDto: any): Observable<any> {
    return this.http.post(Application_Instances_Url, applicationInstanceDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
    );
  }
}
