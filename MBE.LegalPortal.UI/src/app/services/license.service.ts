import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { License_Url, OfflineLicense_Url, Violation_Url, Machine_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { ILicense } from '../interfaces/license';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  errorMessage = '';
  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getLicense(page: number, pageSize: number, sort?: Sort, keyword?: string): Observable<any> {
    // Constructing query parameters
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (sort?.direction !== undefined && sort?.direction !== '') {
      const direction = sort.direction === 'asc' ? 'Asc' : 'Desc';
      params = params.set('sortDirection', direction);
    }
    else {
      const direction = 'Desc';
      params = params.set('sortDirection', direction);
    }

    if (sort?.active !== undefined) {
      params = params.set('orderBy', sort.active);
    }
    else {
      params = params.set('orderBy', 'id');
    }

    if (keyword !== undefined && keyword.trim() !== '') {
      params = params.set('keyword', keyword.trim());
    }
    return this.http.get<any>(`${License_Url}`, { params })
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  getLicenseById(id: number): Observable<any> {
    return this.http.get<any>(`${License_Url}/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  getLicenseByTenantId(id: number): Observable<ILicense> {
    return this.http.get<any>(`${License_Url}/ByTenantId/${id}`)
      .pipe(
        map(response => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  getLicenseBySubscriptionPlanId(id: number): Observable<any> {
    // Constructing query parameters
    let params = new HttpParams();
    const direction = 'Desc';
    params = params.set('sortDirection', direction);
    params = params.set('orderBy', 'id');
    params = params.set('subscriptionPlanId', id);

    return this.http.get<any>(License_Url, { params })
      .pipe(
        map(response => response.data),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  createLicense(data: any): Observable<any> {
    return this.http.post(License_Url, data).pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  updateLicense(id: any, licenseDto: any): Observable<any> {
    return this.http.put(`${License_Url}/${id}`, licenseDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  deleteLicense(id: number) {
    return this.http.delete<void>(`${License_Url}/${id}`);
  }

  getOfflineLicense(id:number) {
    return this.http.get(`${OfflineLicense_Url}/GetOfflineLicense?Id=${id}`, { responseType: 'blob' })
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  getViolationByLicenseId(id: number, page: number, pageSize: number): Observable<any>{
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get(`${Violation_Url}?LicenseId=${id}`, { params })
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  deleteMachineById(id:any) {
    return this.http.delete<void>(`${Machine_Url}/${id}`);
  }
}
