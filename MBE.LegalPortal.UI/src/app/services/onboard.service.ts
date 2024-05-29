import { Injectable } from '@angular/core';
import { ErrorHandlingService } from './error-handling-service';
import { HttpClient } from '@angular/common/http';
import { IOnBoard } from '../interfaces/onboard';
import { OnBoard_Url } from '../constants/apis-constants';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnboardService {

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  // create onboard wizard....
  createOnBoardService(createOnBoardDto: any): Observable<any> {
    return this.http.post(OnBoard_Url, createOnBoardDto)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
}
