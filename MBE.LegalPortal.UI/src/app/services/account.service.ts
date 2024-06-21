import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Accounts_GetAll_Url, Accounts_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { IAccount } from '../interfaces/account';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getAccountsAll(): Observable<IAccount[]> {
    // Constructing query parameters
    let params = new HttpParams();
    const direction = 'Desc';
    params = params.set('sortDirection', direction);
    params = params.set('orderBy', 'id');

    return this.http.get<IAccount[]>(Accounts_GetAll_Url, { params })
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
    return this.http.get<any>(Accounts_Url, { params })
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  createAccount(CreateAccountDto: any): Observable<any> {
    return this.http.post(Accounts_Url, CreateAccountDto);
  }

  updateAccount(accountDto: any): Observable<any> {
    return this.http.put(`${Accounts_Url}/${accountDto.id}`, accountDto);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${Accounts_Url}/${id}`);
  }
}
