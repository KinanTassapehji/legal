import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlingService } from './error-handling-service';
import { Observable,catchError, map } from 'rxjs';
import { Tenants_Url } from '../constants/apis-constants';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  errorMessage = '';
  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getTenantById(id: number): Observable<any>{
    return this.http.get<any>(`${Tenants_Url}/${id}`)
    .pipe(
      map(response => response.data),
      catchError(error => this.errorHandlingService.handleError(error))
    )
  }

}
