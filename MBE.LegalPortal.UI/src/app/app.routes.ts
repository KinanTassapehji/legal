import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ApplicationComponent } from './components/application/application.component';
import { SubscriptionPlanComponent } from './components/subscription-plan/subscription-plan.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { LicenseComponent } from './components/license/license.component';
import { ResellerComponent } from './components/reseller/reseller.component';
import { ResellerDashboardComponent } from './components/reseller/reseller-dashboard/reseller-dashboard.component';
import { RegionCountryComponent } from './components/region-country/region-country.component';
import { LicenseDetailsComponent } from './components/license/license-details/license-details.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: '', component: ApplicationComponent, pathMatch: 'full', canActivate: [MsalGuard] },
  { path: 'applications', component: ApplicationComponent, canActivate: [MsalGuard] },
  { path: 'subscriptionPlans', component: SubscriptionPlanComponent, canActivate: [MsalGuard] },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [MsalGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [MsalGuard] },
  { path: 'license', component: LicenseComponent, canActivate: [MsalGuard] },
  { path: 'reseller', component: ResellerComponent, canActivate: [MsalGuard] },
  { path: 'reseller/dashboard', component: ResellerDashboardComponent, canActivate: [MsalGuard] },
  { path: 'region/country', component: RegionCountryComponent, canActivate: [MsalGuard] },
  { path: 'license/details/:id', component: LicenseDetailsComponent, canActivate: [MsalGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [MsalGuard] },
];
