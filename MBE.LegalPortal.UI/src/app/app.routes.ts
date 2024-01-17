import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PublicPageComponent } from './public-page/public-page.component';
import { PrivatePageComponent } from './private-page/private-page.component';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'public', component: PublicPageComponent },
  { path: 'private', component: PrivatePageComponent, canActivate: [MsalGuard] },
];
