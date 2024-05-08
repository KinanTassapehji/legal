import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlingService } from './error-handling-service';
import { Media_Url } from '../constants/apis-constants';

@Injectable({
  providedIn: 'root'
})

export class MediaService {

  constructor(private http: HttpClient, private errorHandlingService: ErrorHandlingService) { }

  UploadImage(folder: string, formData: FormData): Observable<any> {
    // Construct the URL with the folder parameter
    const uploadUrl = Media_Url + `?Folder=${folder}`;

    return this.http.post<any>(uploadUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        // Delegate error handling to ErrorHandlingService
        return this.errorHandlingService.handleError(error);
      })
    );
  }
}
