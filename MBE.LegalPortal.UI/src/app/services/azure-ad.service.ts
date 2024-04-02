import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IProfile } from '../interfaces/profile';
import { MsalService } from '@azure/msal-angular';
import { GRAPH_ENDPOINT } from '../constants/azure-constants';

@Injectable({
  providedIn: 'root'
})

export class AzureAdService {
  isUserLoggedIn: Subject<boolean> = new Subject<boolean>();
  userName?: string = '';

  constructor(private httpClient: HttpClient, private msalService: MsalService) { }

  login(): void {
    this.msalService.loginPopup()
      .subscribe(() => {
        // User has logged in successfully
      });
  }

  logout(): void {
    this.msalService.logout();
  }

  getUserProfile() {
    return this.httpClient.get<IProfile>(GRAPH_ENDPOINT);
  }
}
