import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PrivatePageComponent } from './components/private-page/private-page.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'private', component: PrivatePageComponent, canActivate: [MsalGuard] },
];
