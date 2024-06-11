import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Machine_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  createMachine(CreateMachineDto: any): Observable<any> {
    return this.http.post(Machine_Url, CreateMachineDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  deleteMachineById(id: any) {
    return this.http.delete<void>(`${Machine_Url}/${id}`);
  }
}
