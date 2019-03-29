import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatSidenavModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AccountModule} from './account/account.module';
import {MailModule} from './mail/mail.module';
import {InlineNavigationModule} from './core/navigation/components/inline-navigation/inline-navigation.module';
import {PageTitleModule} from './core/title/components/page-title/page-title.module';
import {TasksModule} from './tasks/tasks.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AccountModule,
    BrowserModule,
    CoreModule,
    FlexLayoutModule,
    DashboardModule,
    InlineNavigationModule,
    MatSidenavModule,
    MailModule,
    PageTitleModule,
    SettingsModule,
    TasksModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
