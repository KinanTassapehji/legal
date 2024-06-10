import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import {  Settings_Url } from '../constants/apis-constants';
import { ErrorHandlingService } from './error-handling-service';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  errorMessage = '';

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  getSettings(page: number, pageSize: number, sort?: Sort, keyword?: string): Observable<any> {
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
    return this.http.get<any>(Settings_Url, { params })
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  createSetting(CreateSettingDto: any): Observable<any> {
    return this.http.post(Settings_Url, CreateSettingDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  updateSetting(settingDto: any): Observable<any> {
    return this.http.put(`${Settings_Url}/${settingDto.id}`, settingDto)
      .pipe(
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  deleteSetting(id: number): Observable<void> {
    return this.http.delete<void>(`${Settings_Url}/${id}`);
  }
}
