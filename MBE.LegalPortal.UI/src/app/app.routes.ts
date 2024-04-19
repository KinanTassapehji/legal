import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { ApplicationComponent } from './components/application/application.component';
import { SubscriptionPlanComponent } from './components/subscription-plan/subscription-plan.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';

export const routes: Routes = [
  { path: '', component: ApplicationComponent, pathMatch: 'full', canActivate: [MsalGuard] },
  { path: 'applications', component: ApplicationComponent, canActivate: [MsalGuard] },
  { path: 'subscriptionPlans', component: SubscriptionPlanComponent, canActivate: [MsalGuard] },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [MsalGuard] },
];
