import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine_Url } from '../constants/apis-constants';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  errorMessage = '';

  constructor(private http: HttpClient) { }

  createMachine(CreateMachineDto: any): Observable<any> {
    return this.http.post(Machine_Url, CreateMachineDto);
  }

  deleteMachineById(id: any) {
    return this.http.delete<void>(`${Machine_Url}/${id}`);
  }
}
