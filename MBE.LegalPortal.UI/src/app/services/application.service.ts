import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, pipe, tap, throwError } from 'rxjs';
import { IApplication } from '../interfaces/application';
import { AzureAdService } from './azure-ad.service';
import { Applications_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';

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

  deleteApplication(id: number): Observable<void> {
    const url = '${Applications_Url}/${id}';
    return this.http.delete<void>(url)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }
}
