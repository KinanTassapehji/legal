import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { IApplication } from '../interfaces/application';
import { Accounts_GetAll_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { IAccount } from '../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getAccounts(): Observable<IAccount[]> {
    return this.http.get<IApplication[]>(Accounts_GetAll_Url)
      .pipe(
        map((response: any) => response),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }
}
