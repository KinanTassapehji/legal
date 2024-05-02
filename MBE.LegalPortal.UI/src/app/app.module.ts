import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService, MsalBroadcastService, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MSAL_INTERCEPTOR_CONFIG, MsalInterceptorConfiguration, ProtectedResourceScopes } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication, IPublicClientApplication } from '@azure/msal-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { Client_ID, Access_As_User_Scope, Tenant_ID, GRAPH_ENDPOINT } from './constants/azure-constants';
import { environment } from '../environments/environment';
import { HeaderComponent } from './shared/dashboard-layout/header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from './shared/dashboard-layout/sidenav/sidenav.component';
import { MaterialModule } from '../Material.Module';
import { LayoutComponent } from './shared/dashboard-layout/layout/layout.component';
import { ApplicationComponent } from './components/application/application.component';
import { AddApplicationComponent } from './components/application/add-application/add-application.component';
import { AddApplicationInstanceComponent } from './components/application/add-application-instance/add-application-instance.component';
import { SubscriptionPlanComponent } from './components/subscription-plan/subscription-plan.component';
import { CardComponent } from './shared/card/card.component';
import { loginRequest, msalConfig } from './auth/auth-config';
import { AddSubscriptionPlanComponent } from './components/subscription-plan/add-subscription-plan/add-subscription-plan.component';
import { ApplicationInstanceOverviewComponent } from './components/application/application-instance-overview/application-instance-overview.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AddAccountComponent } from './components/accounts/add-account/add-account.component';
import { ConfirmationPopupComponent } from './shared/popups/confirmation-popup/confirmation-popup.component';
import { LicenseComponent } from './components/license/license.component';
import { CreateLicenseComponent } from './components/license/create-license/create-license.component';
import { ResellerComponent } from './components/reseller/reseller.component';
import { CreateResellerComponent } from './components/reseller/create-reseller/create-reseller.component';
import { ResellerDashboardComponent } from './components/reseller/reseller-dashboard/reseller-dashboard.component';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();

  protectedResourceMap.set(GRAPH_ENDPOINT, [
    {
      httpMethod: 'GET',
      scopes: ['user.read']
    }
  ]);
  protectedResourceMap.set("*", [
    {
      httpMethod: 'GET',
      scopes: [Access_As_User_Scope]
    },
    {
      httpMethod: 'POST',
      scopes: [Access_As_User_Scope]
    },
    {
      httpMethod: 'PUT',
      scopes: [Access_As_User_Scope]
    },
    {
      httpMethod: 'DELETE',
      scopes: [Access_As_User_Scope]
    }
  ]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    LayoutComponent,
    ApplicationComponent,
    AddApplicationComponent,
    AddApplicationInstanceComponent,
    SubscriptionPlanComponent,
    CardComponent,
    ApplicationInstanceOverviewComponent,
    AddSubscriptionPlanComponent,
    OnboardingComponent,
    AccountsComponent,
    AddAccountComponent,
    ConfirmationPopupComponent,
    LicenseComponent,
    CreateLicenseComponent,
    ResellerComponent,
    CreateResellerComponent,
    ResellerDashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    MsalModule.forRoot(new PublicClientApplication
      (
        {
          auth:
          {
            clientId: Client_ID,
            redirectUri: environment.BASE_URL,
            authority: 'https://login.microsoftonline.com/' + Tenant_ID
          },
          cache:
          {
            cacheLocation: 'localStorage',
              storeAuthStateInCookie:false
          }
        }
    ),
      {
        interactionType: InteractionType.Redirect,
        authRequest:
        {
          scopes: ['user.read']
          }
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map(
          [
            [GRAPH_ENDPOINT, ['user.read']],
            [environment.API_BASE_URL, [Access_As_User_Scope]],
          ]
        )
      },
    ),
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    provideAnimationsAsync()],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
