import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { License_Url, Tenants_Url, Application_Instances_Url } from '../constants/apis-constants';
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
  getApplicationIntanceId(tenantId?: number): Observable<any> {
    return this.http.get<any>(`${Tenants_Url}/${tenantId}`).pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
  getApplicationAndAccount(applicationInstanceId?: number): Observable<any> {
    return this.http.get<any>(`${Application_Instances_Url}/${applicationInstanceId}`).pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
}
