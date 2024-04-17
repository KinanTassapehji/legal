import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { License_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { ILicense } from '../interfaces/license';

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
}
