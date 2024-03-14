import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map } from 'rxjs';
import { IProfile } from '../interfaces/profile';
import { environment } from '../../environments/environment';

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';
const Regions_Api_Url = environment .API_BASE_URL+ 'api/Region/';

@Injectable({
  providedIn: 'root'
})

export class AzureAdService {
  isUserLoggedIn: Subject<boolean> = new Subject<boolean>();
  userName?: string = '';

  constructor(private httpClient: HttpClient) { }

  getUserProfile() {
    return this.httpClient.get<IProfile>(GRAPH_ENDPOINT);
  }

  getRegions() {
    return this.httpClient.get<any>(Regions_Api_Url).pipe(
      map(response => response.data)
    );
  }
}
