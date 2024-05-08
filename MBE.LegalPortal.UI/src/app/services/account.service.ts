import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { IApplication } from '../interfaces/application';
import { Accounts_GetAll_Url, Accounts_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { IAccount } from '../interfaces/account';
import { Sort, SortDirection } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getAccountsAll(): Observable<IAccount[]> {
    return this.http.get<IAccount[]>(Accounts_GetAll_Url)
      .pipe(
        map((response: any) => response),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  getAccounts(page: number, pageSize: number, sort?: Sort, keyword?: string): Observable<any> {
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
    return this.http.get<any>(`${Accounts_Url}`, { params })
      .pipe( catchError(error => this.errorHandlingService.handleError(error)));
  }
  //
  createAccounts(CreateAccountDto: any): Observable<any> {
    return this.http.post(Accounts_Url, CreateAccountDto).pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
  //
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${Accounts_Url}/${id}`)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }
}
