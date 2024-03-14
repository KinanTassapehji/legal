import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PrivatePageComponent } from './components/private-page/private-page.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { Clietn_ID, Access_As_User_Scope, Tenant_ID } from './constants/azure-constants';
import { environment } from '../environments/environment';
import { HeaderComponent } from './shared/dashboard-layout/header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from './shared/dashboard-layout/sidenav/sidenav.component';
import { MaterialModule } from '../Material.Module';
import { LayoutComponent } from './shared/dashboard-layout/layout/layout.component';
import { ApplicationComponent } from './components/application/application.component';
import { AddApplicationComponent } from './components/application/add-application/add-application.component';
import { SubscriptionTableComponent } from './components/subscription-table/subscription-table.component';
import { CardComponent } from './shared/card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    PrivatePageComponent,
    HomeComponent,
    HeaderComponent,
    SidenavComponent,
    LayoutComponent,
    ApplicationComponent,
    AddApplicationComponent,
    SubscriptionTableComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    MaterialModule,
    MsalModule.forRoot(new PublicClientApplication
      (
        {
          auth:
          {
            clientId: Clietn_ID,
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
            ['https://graph.microsoft.com/v1.0/me', ['user.Read']],
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
    }, MsalGuard, provideAnimationsAsync()],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }

function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(`MSAL Logging - Level: ${LogLevel[logLevel]}, Message: ${message}`);
}
