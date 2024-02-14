import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PublicPageComponent } from './public-page/public-page.component';
import { PrivatePageComponent } from './private-page/private-page.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { Clietn_ID, Access_As_User_Scope, Tenant_ID } from './constants';
import { environment } from '../environments/environment';
import { HeaderComponent } from './dashboard-layout/header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule } from '@angular/forms';
import { SidenavComponent } from './dashboard-layout/sidenav/sidenav.component';
import { MaterialModule } from '../Material.Module';
import { LayoutComponent } from './dashboard-layout/layout/layout.component';
import { ApplicationComponent } from './components/application/application.component';
import { AddApplicationComponent } from './components/modal/add-application/add-application.component';

@NgModule({
  declarations: [
    AppComponent,
    PrivatePageComponent,
    PublicPageComponent,
    HomeComponent,
    HeaderComponent,
    SidenavComponent,
    LayoutComponent,
    ApplicationComponent,
    AddApplicationComponent,
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
